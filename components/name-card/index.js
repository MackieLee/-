let user = require('../../utils/user')
const app = getApp()
Component({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: user.canIUse,
    secData: app.globalData.secData,
    level: '普通会员',
    point: 0,
    attend: -1,
  },
  ready: function () {
    let _self = this
    // 读取缓存是否有信息
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      })
    }
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        _self.setData({
          level: res.data.level,
          point: res.data.point,
        })
        wx.request({
          url: 'https://api.aiwoqu.com/v1/attend/check',
          data: {
            id: res.data.id
          },
          success(res) {
            _self.setData({
              attend: res.data.code
            })
          }
        })
      },
    })
  },
  methods: {
    // 手动获取用户信息
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var _self = this
          if (res.code) {
            wx.request({
              url: 'https://api.aiwoqu.com/v1/login',
              data: {
                code: res.code,
                userName: app.globalData.userInfo.nickName,
                avatar: app.globalData.userInfo.avatarUrl
              },
              success(res) {
                // 本地存储 secret_key
                try {
                  wx.setStorageSync('secret_key', res.data.secret_key)
                  _self.setData({
                    secData: true
                  })
                } catch (e) {
                  console.error('secret_key存储失败', e)
                }
                // 加载用户额外信息
                try {
                  let userInfo = res.data
                  _self.setData({
                    point: userInfo.point,
                    level: userInfo.level,
                  })
                  // 将用户信息存入本地内存
                  wx.setStorageSync('userInfo', userInfo)
                  // 将返回的用户信息合并到用户信息的全局变量中
                  Object.assign(app.globalData.userInfo, userInfo)
                } catch (e) {
                  console.error('获取或存储用户信息出现异常', e)
                }
                // 请求签到状态
                wx.request({
                  url: 'https://api.aiwoqu.com/v1/attend/check',
                  data: {
                    id: res.data.id
                  },
                  success(res) {
                    _self.setData({
                      attend: res.data.code
                    })
                    wx.getStorage({
                      key: 'userInfo',
                      success: function (res) {
                        let data = res.data
                        data.point = _self.data.point
                        wx.setStorage({
                          key: 'userInfo',
                          data
                        })
                      },
                    })
                  }
                })
              }
            })
          } else {
            console.log('wx.login获取res.code失败')
          }
        }
      })
    },
    bindViewTap: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('viewevent', myEventDetail, myEventOption)
    },
    bindToastTap: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toastevent', myEventDetail, myEventOption)
    },
    // 签到事件
    attend: function () {
      let _self = this
      let id = 0
      if(app.globalData.userInfo.uid) {
        id = app.globalData.userInfo.id
        _self.attendRequest(data)
        console.log('app', id)
      } else {
        wx.getStorage({
          key: 'userInfo',
          success: function(res) {
            id = res.data.id
            _self.attendRequest(id)
            console.log('storage', id)
          },
        })
      }
    },
    // 发送签到请求
    attendRequest: function (id) {
      let _self = this
      wx.request({
        url: 'https://api.aiwoqu.com/v1/attend',
        data: {
          id
        },
        success(res) {
          // 触发签到成功tip
          _self.triggerEvent('toastevent', {})

          wx.request({
            url: 'https://api.aiwoqu.com/v1/attend/check',
            data: {
              id
            },
            success(res) {
              _self.setData({
                attend: res.data.code,
                point: res.data.point
              })
              wx.getStorage({
                key: 'userInfo',
                success: function(res) {
                  let data = res.data
                  data.attend = 1
                  data.point = _self.data.point
                  wx.setStorage({
                    key: 'userInfo',
                    data
                  })
                },
              })
            }
          })
        }
      })
    }
  }
})