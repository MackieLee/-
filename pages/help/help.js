const { $Message } = require('../../dist/base/index');

// pages/help/help.js
Page({
  data: {
    hpList: []
  },
  onLoad: function (options) {
    let _self = this
    console.log(options)
    if(options.del === '1') {
      $Message({
        content: '删除成功！',
        type: 'success'
      });
    }
    wx.request({
      url: 'https://api.aiwoqu.com/v1/syshelp/getMsg',
      success: function(res) {
        _self.setData({
          hpList: res.data
        })
      }
    })
  },
  getInfo(e) {
    let id = e.target.dataset.id
    let param = JSON.stringify(this.data.hpList[id])
    wx.navigateTo({
      url: '/pages/syshelp/syshelp?param='+param,
    })
  }
})