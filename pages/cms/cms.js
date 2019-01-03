const { $Toast } = require('../../dist/base/index');

// pages/cms/cms.js
Page({
  data: {
    current: 'tab1',
    val: '',
    title: '',
    content: ''
  },
  onLoad: function (options) {

  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  handleSuccess(str) {
    $Toast({
      content: str,
      type: 'success'
    });
  },
  getVal(e) {
    this.data.val = e.detail.value
  },
  getHtitle(e) {
    this.data.title = e.detail.value
  },
  getHcont(e) {
    this.data.content = e.detail.value
  },
  promotion() {
    let _self = this
    wx.request({
      url: 'https://api.aiwoqu.com/v1/promote',
      data: {
        content: _self.data.val,
        classid: 0
      },
      success: function(res){
        _self.handleSuccess('公告已成功发布，1s后自动回到首页')
        setTimeout(()=>{
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1000)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  sysHelp() {
    let _self = this
    wx.request({
      url: 'https://api.aiwoqu.com/v1/syshelp',
      data: {
        title: _self.data.title,
        content: _self.data.content
      },
      success:function(res) {
        _self.setData({
          title: '',
          content: ''
        })
        _self.handleSuccess('添加成功，请继续添加或进行其他操作。')
      },
      fail: function(res) {
        console.log('帮助信息添加失败', res)
      }
    })
  }
})