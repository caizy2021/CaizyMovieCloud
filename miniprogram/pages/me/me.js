// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "https://b.yzcdn.cn/vant/icon-demo-1126.png", // 存储用户头像
    nickname: "点击登录", // 存储用户名
    isLogin: false // 存储用户登录状态
  },

  /**
   * 更换头像操作
   */
  changeAvatar() {
    wx.chooseImage({
        count: 1,
      })
      .then(res => {
        this.setData({
          avatar: res.tempFilePaths[0]
        })
        // 把图片上传到云存储
        wx.cloud.uploadFile({
            cloudPath: 'a' + Math.random() + '.jpg',
            filePath: res.tempFilePaths[0]
          })
          .then(uploadRes => {
            // 声明fileID存储上传成功的图片路径
            const fileID = uploadRes.fileID
            // 把图片与当前用户ID绑定，并存入云数据库
            const openid = getApp().globalData.openid
            // 创建数据库db
            const db = wx.cloud.database()
            // 更新数据库中的头像图片路径
            db.collection('users')
              // 根据openid查询要修改的用户
              .where({
                _openid: openid
              })
              // 修改数据
              .update({
                data: {
                  avatar: fileID
                }
              })
          })
      })
  },

  /**
   * 点击头像后触发登录事件
   */
  tapAvatar() {
    if (this.data.isLogin) { // 已登录，则执行更换头像操作
      this.changeAvatar()
    } else { // 未登录，则执行登录操作
      wx.getUserProfile({
        lang: "zh_CN",
        desc: '您的信息将用于登录小程序'
      }).then(res => {
        // 去云函数获取openid，通过openid查询云数据库，验证是否已经注册
        wx.cloud.callFunction({
            name: 'login'
          })
          .then(loginRes => {
            // 获取到openid
            const openid = loginRes.result.openid
            // 存入全局globalData
            getApp().globalData.openid = openid
            // 创建数据库db
            const db = wx.cloud.database()
            // 通过openid查询云数据库，验证是否已经注册
            db.collection('users')
              // 根据openid查询用户
              .where({
                _openid: openid
              })
              // 获取数据
              .get().then(queryRes => {
                if (queryRes.data.length != 0) { // 已经注册过，则渲染数据到页面
                  this.setData({
                    avatar: queryRes.data[0].avatar,
                    nickname: queryRes.data[0].nickname,
                    isLogin: true
                  })
                } else { // 没有注册过，则第一次登录，执行注册
                  // 插入云数据库
                  db.collection('users').add({
                    data: {
                      avatar: res.userInfo.avatarUrl,
                      nickname: res.userInfo.nickName
                    }
                  })
                  this.setData({
                    avatar: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName,
                    isLogin: true
                  })
                }
              })
          })




      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})