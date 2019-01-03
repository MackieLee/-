const app = getApp()
const canIUse = wx.canIUse('button.open-type.getUserInfo')

var getUser = function() {
  var userInfo = {}
  var hasUserInfo = false
  if (app.globalData.userInfo) {
    console.log(app.globalData)
    userInfo = app.globalData.userInfo
    hasUserInfo = true
  } else if (canIUse) {
    app.userInfoReadyCallback = res => {
      userInfo = res.userInfo
      hasUserInfo = true
    }
  } else {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        userInfo = res.userInfo
        hasUserInfo = true
      }
    })
  }

  return { userInfo, hasUserInfo }
}

module.exports = {
  canIUse,
  getUser: getUser()
}