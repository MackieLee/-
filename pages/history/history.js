let user = require('../../utils/user')
const app = getApp()
Page({
  data: {
    avatar: '',
    list: []
  },
  onLoad: function () {
    let _self = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        _self.setData({
          avatar: res.data.avatar
        })
        wx.request({
          url: 'https://api.aiwoqu.com/v1/score/history',
          data: {
            id: res.data.id
          },
          success: function (res) {
            _self.setData({
              list: res.data,
            })
          }
        })
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
  bindViewTap() {
  }
})