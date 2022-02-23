// app.js
App({
  onLaunch() {
    // 初始化腾讯的位置服务SDK
    var QQMapWX = require('libs/qqmap-wx-jssdk')
    var qqmapsdk = new QQMapWX({
      key: '33DBZ-WL7W4-CSBUT-D4NG5-MFVOH-PBBOB'
    })
    this.globalData.qqmapsdk = qqmapsdk
    // 初始化云服务
    wx.cloud.init({
      env: 'caizy-cloud-6gm135y0bfbeb145'
    })
  },
  globalData: {
    userInfo: null,
    CITYNAME: '未选择',
    qqmapsdk: null
  }
})