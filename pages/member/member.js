const vm = require('../../utils/version.js')

Page({
  data: {
    level: false,
    check: false,
    needUp: true,
    latest: '',
    actions: [
      {
        name: '更新',
        color: '#19be6b'
      },
      {
        name: '取消'
      }
    ]
  },
  onLoad: function() {
    let _self = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        if(res.data.level === '管理员') {
          _self.setData({
            level: true
          })
        }
      },
    })
  },
  // 处理用户点击检查版本事件
  tapChk() {
    let _self = this
    let latest = vm.latest
    let version = vm.version

    wx.request({
      url: 'https://api.aiwoqu.com/v1/version',
      success: function (res) {
        latest = res.data.version
        if (latest === version) {
          _self.setData({
            needUp: false
          })
        } else {
          _self.setData({
            check: true
          })
        }
        _self.setData({
          version,
          latest
        })
      }
    })
  },
  // 处理模态框点击事件
  handleChk({ detail }) {
    const index = detail.index;
    index === 0 ? this.update() : this.closeChk()
  },
  // 更新小程序
  update() {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
    })
  },
  // 关闭检查更新模态框
  closeChk() {
    this.setData({
      check: false
    })
  },
  // 关闭最新版本提示
  closeTip() {
    this.setData({
      needUp: true
    })
  }
})