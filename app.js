//app.js
App({
  onLaunch: function () {
    // 读取storage
    try {
      var value = wx.getStorageSync('secret_key')
      if (value) {
        // 去往后台验证session是否存在
        var _self = this
        wx.request({
          url: 'https://api.aiwoqu.com/v1/check',
          data: {
            'secret_key': value
          },
          success (res) {
            _self.globalData.secData = res.data
          }
        })
      }else{
        this.globalData.secData = false
      }
    } catch (e) {console.log(e)}
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    secData: false
  }
})