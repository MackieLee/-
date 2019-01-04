const { $Toast } = require('../../dist/base/index')
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.obeyMuteSwitch = false
innerAudioContext.title = 'Japanese Listening'

Page({
  data: {
    id: '',
    classid: '',
    arr: [
      ['138', '139', '136', '140'],
      ['132', '133', '134', '135'],
      ['86', '85', '87', '84'],
      ['125', '124', '126', '117'],
      ['129', '128', '130', '127']
    ],
    options: [],
    done: '', // 用户所选答案的编号
    ready: false,
    correct:0,
    incorrect: 0,
    sum: 0,
    clstr: '', // 科目标题字符串
    content: '',
    au: '',
    offset: null,
    starttime: '00:00',
    max: null,
    duration: '00:00',
    changePlay: false,
    isOpen: false,
    ques: '',
    quesStr: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let _self = this
    wx.getStorage({
      key: 'userInfo',
      success: function() {
        let s1 = parseInt(options.tab.split('')[3]) - 1 // 水平等级
        let s2 = options.item // 试题类别
        _self.data.clstr = '日语N' + (s1 + 1) + ['词汇', '语法', '阅读', '听力'][s2]
        _self.data.classid = _self.data.arr[s1][s2] // 对应数据库id
        let classid = _self.data.classid
        var WxParse = require('../../wxParse/wxParse.js')
        _self.getQuiz(classid, WxParse)
      },
      fail: () => {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: '#FD5342'
    })
  },
  choosen: function (ev) {
    let choosen = ev.target.dataset.ansr
    let obj = this.data.options[choosen[1]] // 题目的实际答案
    let key = this.findKey(obj, obj.T)
    this.data.done = choosen[2]

    if (!obj.t /** 如果这道题目尚未完成 */) {
      obj.t = key // 正确选项编号
      obj.f = choosen[2] // 用户选项编号
      this.setData({
        options: this.data.options
      })
      if (key === choosen[2]) {
        this.data.correct++
      } else {
        this.data.incorrect++
      }
      this.data.sum = this.data.correct + this.data.incorrect
    }
  },
  findKey: function (obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
  },
  getQuiz: function(classid, WxParse) {
    let _self = this
    // 获取参数，向后台请求试题数据
    wx.request({
      url: 'https://api.aiwoqu.com/v1/getQuiz',
      data: {
        classid
      },
      success: function (res) {
        if (res.data) {
          _self.setData({
            ready: true
          })
        }
        if (res.data.A != '') {
          let content = res.data.content
          // console.log('content', content)
          var patt1 = /font\-family\:\"/g
          var patt2 = /\"\=\"\"/g

          let str = content.replace(patt1, '')
          str = str.replace(patt2, '"')
          // console.log('str', str)
          WxParse.wxParse('article', 'html', str, _self);
          // 单个问题
          _self.setData({
            options: [
              {
                A: res.data.A,
                B: res.data.B,
                C: res.data.C,
                D: res.data.D,
                T: res.data.T,
                ques: res.data.ques
              }
            ],
            content: str,
            id: res.data.id
          })
        } else {
          // 多问题
          let id = res.data.id
          let content = res.data.content
          // console.log('content', content)
          var patt1 = /font\-family\:\"/g
          var patt2 = /\"\=\"\"/g

          let str = content.replace(patt1, '')
          str = str.replace(patt2, '"')
          // console.log('str', str)

          let head = str.substr(0, 7)
          if(head === 'uploads') {
            _self.setData({
              id,
              au: str
            })
          } else {
            _self.setData({
              content: str,
              id
            })
          }
          WxParse.wxParse('article', 'html', _self.data.content, _self, 5);
          wx.request({
            url: 'https://api.aiwoqu.com/v1/getQuiz',
            data: {
              classid: '',
              id
            },
            success: function (res) {
              // console.log('res', res.data)
              let data = res.data
              let len = data.length
              // console.log(len)
              for (let i = 0; i < len; i++) {
                if(/^\<\img/.test(data[i].content)) {
                  let str = data[i].content
                  str = str.match(/\"([^\"]*)\"/)[1]
                  data[i].content = str
                  _self.setData({
                    quesStr: str
                  })
                }
              }
              // console.log('options',data)
              _self.setData({
                options: data
              })
            }
          })
        }
      }
    })
  },
  nextQuz: function() {
    if(this.data.done) {
      let classid = this.data.classid
      var WxParse = require('../../wxParse/wxParse.js')
      this.getQuiz(classid, WxParse)
      this.data.done = ''
      this.auStop()
    } else {
      $Toast({
        content: '本题尚未完成..'
      })
    }
  },
  // 跳转到成绩单
  ifEndQuz: function() {
    let _self = this
// 确认用户是否结束答题
    wx.showModal({
      title: '',
      content: '您确定要结束答题么？',
      success(res) {
        if (res.confirm) {
          _self.endQuiz()
        }
      }
    })
  },
  endQuiz() {
    this.auStop()
    wx.redirectTo({
      /* @params
      /* clstr => 科目类别名称
      /* sum/correct/incorrect => 题目总数/正确数目/错误数目
      */
      url: '../../pages/transcript/transcript?title=' + this.data.clstr + '&sum=' + this.data.sum + '&correct=' + this.data.correct + '&incorrect=' + this.data.incorrect
    })
  },
  auPlay() {
    let _self = this
    innerAudioContext.src = 'https://www.aiwoqu.com/' + _self.data.au
    // 监听播放结束
    innerAudioContext.onEnded(() => {
      _self.setData({
        starttime: '00:00',
        isOpen: false,
        offset: 0
      })
    })
    innerAudioContext.play()
    innerAudioContext.onPlay(function() {
      innerAudioContext.onTimeUpdate(() => {
        let currentTime = parseInt(innerAudioContext.currentTime)
        let min = "0" + parseInt(currentTime / 60)
        let max = innerAudioContext.duration
        let duration = parseInt(max/60)
        let preDuration = ''
        if(duration < 10) {
          preDuration = '0' + duration
        } else {
          preDuration = duration
        }
        if (parseInt(max % 60) < 10) {
          duration = preDuration + ':0' + parseInt(max % 60)
        } else {
          duration = preDuration + ':' + parseInt(max % 60)
        }
        let sec = currentTime % 60
        if (sec < 10) {
          sec = '0' + sec
        }
        let starttime = min + ':' + sec
        _self.setData({
          offset: currentTime,
          starttime, max, duration,
          changePlay: true
        })
      })
    })
    _self.setData({
      isOpen: true
    })
  },
  auPause() {
    innerAudioContext.pause()
    this.setData({
      isOpen: false,
    })
  },
  auStop() {
    innerAudioContext.stop()
    this.setData({
      duration: '00:00',
      starttime: '00:00',
      offset: 0,
      isOpen: false
    })
    innerAudioContext.offPlay()
    innerAudioContext.offTimeUpdate()
  },
  sliderChange(e) {
    var that = this
    var offset = parseInt(e.detail.value);
    innerAudioContext.play();
    innerAudioContext.seek(offset);
    that.setData({
      isOpen: true,
    })
  },
  // 题干中图片的预览
  quesImgPrev(e) {
    const src = e.target.dataset.src
    if(src) {
      wx.previewImage({
        current: src,
        urls: [src]
      })
    }
  },
  onUnload() {
    this.auStop()
  }
})