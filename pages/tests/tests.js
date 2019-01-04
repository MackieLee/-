Page({
  data: {
    currentTab: 'tab1',
    currentTabBar: '',
    tabSeries: [
      { 'id': 'tab1', 'name': '日语N1' },
      { 'id': 'tab2', 'name': '日语N2' },
      { 'id': 'tab3', 'name': '日语N3' },
      { 'id': 'tab4', 'name': '日语N4' },
      { 'id': 'tab5', 'name': '日语N5' },
    ],
    subTab: ['词汇', '语法', '阅读', '听力'],
    tabBar: [
      { 'key': 'index', 'icon': 'homepage', 'current': 'homepage_fill', 'link': '', 'title': '首页' },
      { 'key': 'activity', 'icon': 'coupons', 'current': 'coupons_fill', 'link': '', 'title': '活动' },
      { 'key': 'help', 'icon': 'feedback', 'current': 'feedback_fill', 'link': '', 'title': '帮助' },
      { 'key': 'member', 'icon': 'mine', 'current': 'mine_fill', 'link': '', 'title': '我的' },
    ]
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: '#FD5342'
    })
  },
  handleChange({ detail }) {
    this.setData({
      currentTab: detail.key
    });
  },
  handleTabBar({ detail }) {
    wx.navigateTo({
      url: '../../pages/' + detail.key + '/' + detail.key,
    })
  },
  bindCardTap: function(e) {
    //  通过dataset来获取所点击的目标
    let index = e.target.dataset.id
    wx.navigateTo({
      url: '../../pages/questions/questions?tab='+this.data.currentTab+'&item='+index,
    })
  },
  onShareAppMessage(res) {
    let that = this
    let obj = {
      title: '爱沃趣日语题库',
      path: '/pages/index/index',
      imageUrl: 'https://api.aiwoqu.com/static/img/share.jpeg'
    }
    return obj
  }
})