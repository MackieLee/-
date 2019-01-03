const sentence = require('../../utils/sentence.js')
const { $Toast } = require('../../dist/base/index')
const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

Page({
  data: {
    title: '',
    sum: 0,
    correct: 0,
    incorrect: 0,
    avatar: '1',
    avatarPath: '',
    nickName: '爱沃趣忠实粉丝',
    tmpImg: '',
    showShareImg: false,
    width: '375px',
    height: '667px',
    wxcode: '',
    st: null
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      title: options.title,
      sum: options.sum,
      correct: options.correct,
      incorrect: options.incorrect
    })
    // 获取随机一条句子
    let ran = parseInt(sentence.length * Math.random())
    that.data.st = sentence[ran]

    // 向后台发送分数
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: 'https://api.aiwoqu.com/v1/score',
          data: {
            id: res.data.id,
            avatar: res.data.avatar,
            username: res.data.username,
            score: that.data.correct
          },
          success: (res) => {
            console.log(res.data)
          }
        })
      },
    })
    // 获取头像地址
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        let avatar = res.data.avatar
        let id = res.data.id
        that.data.nickName = res.data.username
        wx.request({
          url: 'https://api.aiwoqu.com/v1/avatar',
          data: {
            id,
            avatar
          },
          success: function (response) {
            // 在服务器端转发用户头像
            that.data.avatar = response.data
            console.log(that.data.avatar)
            that.downloadAvatar()
          }
        })
      },
    })
  },
  // 下载图片
  downloadAvatar: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.avatar,
      success: function (res) {
        that.setData({
          // 用户头像的临时文件
          avatarPath: res.tempFilePath
        })

        // 请求并下载小程序码
        wx.request({
          url: 'https://api.aiwoqu.com/v1/wxcode',
          success(res) {
            wx.downloadFile({
              url: res.data,
              success: function (res) {
                that.setData({
                  wxcode: res.tempFilePath
                })
                // 根据设备尺寸设置canvas图片大小
                wx.getSystemInfo({
                  success: function (res) {
                    that.setData({
                      width: 0.8 * res.windowWidth,
                      height: 0.8 * res.windowHeight
                    })
                    that.drawImage(that);
                  },
                })
              }
            })
          }
        })
      }
    })
  },
  drawImage: function (that) {
    let ctx = wx.createCanvasContext('share');
    let bgPath = that.data.avatarPath
    let nickName = that.data.nickName
    let dw = that.data.width
    let dh = that.data.height
    // console.log(dw, dh)
    // 绘制背景
    ctx.drawImage('../../assets/bg.jpeg', 0, 0, dw, dh)
    // 初始化栅格 竖向 12格
    let cell = dh / 12
    // 获取并绘制时间
    let date = new Date()
    let year = date.getFullYear()
    let mon = Months[date.getMonth()]
    let day = date.getDate()
    let tinyFont = 12
    let smFont = 14
    let midFont = 16

    /** 绘制矩形 */

    // 绘制矩形1
    that.roundRect(ctx, dw * 0.1, 7 * cell, dw * 0.8, 3.25 * cell, dw * 0.03)
    // 绘制矩形2
    that.roundRect(ctx, dw * 0.1, 10.5 * cell, dw * 0.8, 1.25 * cell, dw * 0.03)

    /** 绘制图片 */

    // 绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(dw * 0.1 + cell * 0.75, 7.75 * cell, cell / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(that.data.avatarPath, dw * 0.1 + cell * 0.25, 7.25 * cell, cell, cell)
    ctx.restore()
    // 绘制小程序码
    ctx.drawImage(that.data.wxcode, dw * 0.9 - cell * 1.125, 10.625 * cell, cell, cell)
    // 绘制公司logo
    ctx.drawImage('../../assets/logo.png', dw * 0.1 + cell * 0.125, 10.625 * cell, cell, cell)

    /** 绘制文字 */

    // 绘制day
    ctx.setFontSize(parseInt(cell * 1.5))
    ctx.setFillStyle('#fff')
    ctx.setTextAlign('left')
    ctx.fillText(day, dw * 0.1 - tinyFont, 1.5 * cell)
    // 绘制箴言
    if (dw < 300) {
      ctx.font = 'normal bold 14px SimSun'
    } else {
      ctx.font = 'normal bold 16px SimSun'
    }
    ctx.fillText(that.data.st.jp, dw * 0.1, 3 * cell)
    // 绘制日期
    ctx.font = 'normal normal 12px SimSun';
    ctx.fillText(mon + ' ' + year, dw * 0.1, 2 * cell)
    // 绘制文字出处
    ctx.fillText(that.data.st.cn, dw * 0.1, 4 * cell + tinyFont)
    // 绘制题库名称
    ctx.setFillStyle('#A29FA2')
    ctx.fillText('在[' + that.data.title + ']进行了测试', dw * 0.1 + 1.5 * cell, 8 * cell + tinyFont)
    // 绘制用户名
    ctx.setFontSize(midFont)
    ctx.setFillStyle('#000')
    ctx.fillText(that.data.nickName, dw * 0.1 + 1.5 * cell, 7.75 * cell)
    // 绘制公司名称
    ctx.setFillStyle('#00BEFE')
    ctx.font = 'normal bold 14px SimSun';
    ctx.fillText('爱沃趣题库', dw * 0.1 + cell * 1.125, 11 * cell)
    // 绘制广告语
    ctx.setFillStyle('#A29FA2')
    ctx.font = 'normal normal 10px SimSun';
    ctx.fillText('学日语，就上爱沃趣', dw * 0.1 + cell * 1.125, 11.125 * cell + tinyFont)
    // 绘制正确率和错误率
    ctx.setTextAlign('center')
    ctx.setFillStyle('#000')
    ctx.font = 'normal normal 16px SimSun';
    ctx.fillText(that.data.correct + '/' + that.data.sum, dw * 0.3, 9.5 * cell + tinyFont)
    ctx.fillText(that.data.incorrect + '/' + that.data.sum, dw * 0.7, 9.5 * cell + tinyFont)
    // 绘制正确率和错误率标题
    ctx.font = 'normal normal 12px SimSun';
    ctx.setFillStyle('#A29FA2')
    ctx.fillText('正确率', dw * 0.3, 9.25 * cell)
    ctx.fillText('错误率', dw * 0.7, 9.25 * cell)

    /** 绘制线条 */

    // 绘制短横线
    ctx.beginPath()
    ctx.setStrokeStyle('#fff')
    ctx.setLineWidth('2')
    ctx.moveTo(dw * 0.1, 3.5 * cell)
    ctx.lineTo(dw * 0.1 + smFont * 2, 3.5 * cell)
    // 绘制横向分割线
    ctx.setStrokeStyle('#A29FA2')
    ctx.setLineWidth('1')
    ctx.moveTo(dw * 0.1 + cell * 0.25, 8.75 * cell)
    ctx.lineTo(dw * 0.9 - cell * 0.25, 8.75 * cell)
    // 绘制竖向分割线
    ctx.moveTo(dw * 0.5, 9 * cell)
    ctx.lineTo(dw * 0.5, 10 * cell)
    ctx.stroke()
    ctx.closePath()

    ctx.draw()
  },
  /**
    * @param {CanvasContext} ctx canvas上下文
    * @param {number} x 圆角矩形选区的左上角 x坐标
    * @param {number} y 圆角矩形选区的左上角 y坐标
    * @param {number} w 圆角矩形选区的宽度
    * @param {number} h 圆角矩形选区的高度
    * @param {number} r 圆角的半径
  */
  roundRect(ctx, x, y, w, h, r) {
    ctx.save()
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('#fff')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
    ctx.restore()
  },

  createShare() {
    $Toast({
      content: '分享图片生成中...',
      duration: 4
    });
    setTimeout(this.showShare, 4000)
  },
  showShare() {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'share',
      destHeight: that.data.height * 3,
      destWidth: that.data.width * 3,
      success: function (res) {
        that.setData({
          tmpImg: res.tempFilePath,
          showShareImg: true
        })
        $Toast({
          content: '分享图片生成完成,请长按图片进行保存',
          type: 'success'
        });
      },
      fail: function (res) {
        console.log(res)
      }
    }, that)
  },
  share() {
    let that = this
    console.log('share', that.data.tmpImg)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.tmpImg,
      success: (res) => {
        $Toast({
          content: '图片保存成功',
          type: 'success'
        });
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  onShareAppMessage(res) {
    let that = this
    let obj = {
      title: '爱沃趣日语题库',
      path: '/pages/index/index'
    }
    if (res.from === 'button') {
      obj.imageUrl = 'https://api.aiwoqu.com/static/img/share.jpeg'
    }
    
    return obj
  }
})