const { $Message } = require('../../dist/base/index');
// pages/syshelp/syshelp.js
Page({
  data: {
    delM: false,
    admin: false,
    edit: false,
    title: '',
    content: '',
    mdlOpt: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ]
  },
  onLoad: function (options) {
    let _self = this
    // 判断用户是否有管理权限
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        let admin = res.data.level === '管理员'? true:false
        _self.setData({
          admin
        })
      },
    })
    let obj = JSON.parse(options.param)
    console.log(obj)
    this.setData({
      title: obj.title,
      id: obj.id,
      content: obj.content
    })
  },
  getHtitle(e) {
    this.data.title = e.detail.value
  },
  getHcont(e) {
    this.data.content = e.detail.value
  },
  editMode: function() {
    this.setData({
      edit: true
    })
  },
  handleCancle: function() {
    this.setData({
      edit: false
    })
  },
  mdlOpen: function() {
    this.setData({
      delM: true
    })
  },
  delAction: function({detail}) {
    let _self = this
    if (detail.index === 0) {
      _self.setData({
        delM: false
      });
    } else {
      const action = [..._self.data.mdlOpt];
      action[1].loading = true;

      _self.setData({
        mdlOpt: action
      });
      // 执行删除操作
      wx.request({
        url: 'https://api.aiwoqu.com/v1/syshelp/delMsg',
        data: {
          id: _self.data.id
        },
        success(res) {
          setTimeout(() => {
            action[1].loading = false;
            _self.setData({
              delM: false,
              mdlOpt: action
            });
            wx.navigateTo({
              url: '/pages/help/help?del=1',
            })
          }, 2000)
        },
        fail(res) {
          setTimeout(() => {
            action[1].loading = false;
            $Message({
              content: '删除失败！',
              type: 'error'
            })
          }, 2000)
        }
      })
    }
  },
  update: function() {
    let _self = this
    wx.request({
      url: 'https://api.aiwoqu.com/v1/syshelp/update',
      data: {
        id: _self.data.id,
        title: _self.data.title,
        content: _self.data.content
      },
      success: function(res) {
        _self.setData({
          title: res.data.title,
          content: res.data.content,
          edit: false
        })
        $Message({
          content: '更新成功！',
          type: 'success'
        })
      },
      fail: function(res) {
        $Message({
          content: '删除失败！',
          type: 'error'
        })
        console.log('更新失败', res)
      }
    })
  }
})