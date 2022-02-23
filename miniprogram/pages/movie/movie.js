// pages/movie/movie.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {}, // 电影详情数据
        isOpen: false, // 是否展开详情信息
        comments: [] // 当前电影的评论信息数据
    },

    /**
     * 点击详情信息
     */
    tapDesc() {
        this.setData({
            isOpen: !this.data.isOpen
        })
    },

    /**
     * 点击大图浏览剧照列表
     */
    tapPreviewImage(event) {
        const index = event.currentTarget.dataset.index
        const imageUrls = this.data.movie.thumb
        const newUrls = []
        imageUrls.forEach(item => {
            newUrls.push(item.substr(0, item.lastIndexOf('@')))
        })
        wx.previewImage({
            urls: newUrls,
            current: newUrls[index]
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const id = options.id
        // 发送请求，获取电影详情数据
        wx.request({
            url: 'https://api.tedu.cn/detail.php',
            method: 'GET',
            data: {
                id: id
            },
            success: (res) => {
                this.setData({
                    movie: res.data
                })
            }
        })
        // 访问云数据库，加载评论信息数据
        const db = wx.cloud.database()
        db.collection('comments')
            .where({
                'movieid': id
            })
            .skip(0).limit(4)
            .get()
            .then(res => {
                this.setData({
                    comments: res.data
                })
            })
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