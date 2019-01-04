// pages/abt/abt.js
Page({
  data: {
    current:'',
    steps: [
      {
        title: '2016年8月1日 沈阳沃趣教育科技有限公司成立',
        content: '网校在辽宁省沈阳市正式成立，确定日语网校名称为爱沃趣',
        imgUrl: 'https://api.aiwoqu.com/static/abt/logo1.png',
        extr: '第一版logo为一只由蓝、橙、绿三色构成的盘踞着的凤凰图案。最上面的蓝色代表天空，下面的绿色代表大地，盘踞的凤凰意为“以谦虚的姿态“中间的橙色，为我们和所有学员，活力无限，在蓝天与大地之间绽放青春。该logo寓意为所有学员们一样，在同一片蓝天下，在同一片沃土上，以谦虚的姿态，绽放自己的青春年华。',
        icon: 'web2'
      },
      {
        title: '2016年10月1日 第一版日语假名卡牌正式发售',
        content: '沃趣教育的第一代实体卡牌',
        imgUrl: 'https://api.aiwoqu.com/static/abt/card1.png',
        icon: 'qiapai'
      },
      {
        title: '2017年5月1日 爱沃趣日语网校累积注册会员突破1万人',
        icon: 'fangwenliang'
      },
      {
        title: '2017年6月1日 第二版logo上线',
        content: '沃趣教育的第二版logo',
        imgUrl: 'https://api.aiwoqu.com/static/abt/logo2.png',
        extr: '该版logo为一只展翅的蓝色凤凰。深蓝色给人以成熟稳重的感觉。凤凰的身体为樱花花瓣，花蕊为一颗圆点以射线的形式连接周围数颗小圆点寓意为爱沃趣日语网校像一个大家庭一样，将来自五湖四海的同学们紧紧相连。凤凰翅膀上长短不一的弧线由下至上表示我们在学习与生活中，要不断向上攀登，要不断向前，虽然中途会有一些坎坷，但我们不曾放弃。',
        icon: 'jiangbei'
      },
      {
        title: '公司字母logo',
        imgUrl: 'https://api.aiwoqu.com/static/abt/fig.png',
        extr: '字母logo为积极、阳光的蓝色，我们正式称这个蓝色为“沃趣蓝”',
        icon: 'jiangbei'
      },
      {
        title: '2018年2月1日 新版网站进入内部测试阶段',
        icon: 'web2'
      },
      {
        title: '2018年4月1日 新版爱沃趣日语网校正式上线投入运营',
        icon: 'web2'
      },
      {
        title: '2018年6月1日 第二版日语假名卡牌正式发售',
        imgUrl: 'https://api.aiwoqu.com/static/abt/card2.png',
        extr: '颜色由绿色变为沃趣蓝，且进行了圆角处理，更便携，更安全。',
        icon: 'qiapai'
      },
      {
        title: '2018年8月1日 沃趣狗诞生',
        content: '爱沃趣日语网校吉祥物——沃趣狗诞生',
        imgUrl: 'https://api.aiwoqu.com/static/abt/ani.png',
        extr: '狗的汉语发音为gou，和日语ご的发音很像。ご在日语当中有“语言“的意思，故因此得名“沃趣狗”。沃趣狗原形为秋田犬，并且是僧人造型，表示心灵纯净，虔诚与专注。',
        icon: 'jiangbei'
      },
      {
        title: '2018年10月1日 全面开启全站VIP收费模式',
        content: '网校模式从此改为全站VIP收费模式，从学员角度出发，让学员得到最大的实惠。',
        icon: 'myvip'
      },
      {
        title: '2018年11月1日 爱沃趣日语网校全站VIP实体卡发售',
        imgUrl: 'https://api.aiwoqu.com/static/abt/lice.jpg',
        icon: 'qiapai'
      },
      {
        title: '2019年1月1日 爱沃趣日语题库小程序上线',
        icon: 'xiaochengxu'
      }
    ]
  },
  onLoad: function (options) {

  },
  step(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      current: index
    })
  }
})