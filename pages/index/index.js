//index.js
//获取应用实例
const app = getApp()
const { $Toast } = require('../../dist/base/index')
Page({
  data: {
    sysPromote: '暂无公告'
  },
  onLoad: function () {
    let _self = this
    wx.request({
      url: 'https://api.aiwoqu.com/v1/promote/getMsg',
      success: function (res) {
        if(res.data.length !== 0 && res.data[0].content) {
          _self.setData({
            sysPromote: res.data[0].content
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '/pages/member/member'
    })
  },
  bindToastTap() {
    $Toast({
      content: '签到成功',
      type: 'success'
    });
  },
  nav(path) {
    wx.navigateTo({
      url: 'pages/' + path + '/' + path,
    })
  },
  deving() {
    $Toast({
      content: '积分兑换功能即将上线，敬请期待！',
      icon: "time"
    });
  }
})
