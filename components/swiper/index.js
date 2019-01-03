Component({
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    imgUrls: [
      'https://api.aiwoqu.com/static/img/banner.jpeg',
      'https://api.aiwoqu.com/static/img/banner2.jpeg'
    ],
    links: [
      '../user/user',
      '../user/user',
      '../user/user'
    ],
    h: ''
  },
  attached: function() {
    let _self = this
    wx.getSystemInfo({
      success: function(res) {
        _self.setData({
          h: res.windowWidth * 0.5 + 'px'
        })
        // console.log(_self.data)
      },
    })
  },
  methods: {
    //轮播图的切换事件
    swiperChange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current
      })
    },
    //点击指示点切换
    chuangEvent: function (e) {
      this.setData({
        swiperCurrent: e.currentTarget.id
      })
    },
    //点击图片触发事件
    swipclick: function (e) {
      // console.log(this.data.swiperCurrent);
      wx.switchTab({
        url: this.data.links[this.data.swiperCurrent]
      })
    }
  }
})