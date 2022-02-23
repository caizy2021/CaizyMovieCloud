// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    // 电影列表
    movielist: [],
    pageno: 1, // 存储页码
    cid: 1, // 存储当前分类类别ID
    cityname: '未选择' // 存储当前位置信息
  },

  /**
   * 页面显示时
   */
  onShow() {
    // 从app.globalData中获取城市名称并设置
    this.setData({
      cityname: getApp().globalData.CITYNAME
    })
  },

  /**
   * 点击左上角，跳转刀城市列表页面
   */
  tapToCitylist() {
    wx.navigateTo({
      url: '/pages/citylist/citylist',
    })
  },

  /**
   * 点击顶部导航时,执行方法
   */
  tapNav(event) {
    const id = event.target.dataset.id
    if (id == this.data.cid) return
    this.setData({
      cid: id,
      pageno: 1 // 当切换选项卡时，重新初始化页码pageno为1
    })
    // 先去缓存找一圈，如果有数据，则直接加载即可。
    wx.getStorage({
      key: id + "",
      success: (result) => { // 从缓存中可以读取数据
        this.setData({
          movielist: result.data
        })
      },
      fail: (err) => { // 从缓存中没有读到数据，将会会回调fail
        // 发送请求，加载选中项下的第一页电影数据
        this.loadData(id, 0).then(movies => {
          this.setData({
            movielist: movies
          })
          // 把movies存入Storage，把当前类别下的第一页数据缓存下来
          wx.setStorage({
            data: movies,
            key: id + "" // storage的key只能是字符串
          })
        })
      }
    })
  },

  /**
   * 加载电影列表数据
   * @param cid 查询电影列表时传递的类别id
   * @param offset 分页加载时,读取页码的起始位置
   * @returns 将用promise的方式返回查询结果
   */
  loadData(cid, offset) {
    // 弹出加载提示
    wx.showLoading({
      title: '加载中...',
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: 'GET',
        data: {
          cid,
          offset
        },
        success: (result) => {
          // 响应成功后,回调resolve,把电影列表给调用者
          resolve(result.data)
          // 关闭加载提示
          wx.hideLoading()
        }
      })
    })
  },

  /**
   * 通过腾讯服务，加载当前位置
   */
  loadLocation() {
    const qqmapsdk = getApp().globalData.qqmapsdk
    qqmapsdk.reverseGeocoder({
      success: (res) => {
        // 修改cityname的值
        const city = res.result.address_component.city
        this.setData({
          cityname: city
        })
        // 把cityname更新到app的globalData中
        getApp().globalData.CITYNAME = city
      }
    })
  },

  /**
   * 当页面初始化加载时执行
   */
  onLoad() {
    // 获取当前位置
    // wx.getLocation({
    //   altitude: true,
    //   isHighAccuracy: true,
    //   type: "gcj02",
    //   success: (res) => {
    //     console.log(res);
    //   }
    // })
    this.loadLocation()

    // 发送请求,获取热映类别(cid=1)的电影列表
    this.loadData(1, 0).then(movies => {
      // movies是从服务器加载到的列表数据
      this.setData({
        movielist: movies
      })
    })
  },

  /**
   * 触底后执行
   */
  onReachBottom() {
    /**
     * 修改data中的值的两种方式
     * 1.this.data.pageno++           -->  不会更新UI
     * 2.this.setData({pageno: 2})    -->  将会把pageno的值更新到视图层
     */
    this.data.pageno++
    // 发送请求,获取当前类别的下一页数据
    const offset = (this.data.pageno - 1) * 20
    const cid = this.data.cid
    this.loadData(cid, offset).then(movies => {
      this.setData({
        movielist: [...this.data.movielist, ...movies]
      })
    })
  },

  /**
   * 当前页面执行下拉刷新时触发事件
   */
  onPullDownRefresh() {
    // 获取当前cid，调用API，访问当前cid下的第一页数据
    // 当新数据加载完毕时，将其存入缓存
    this.loadData(this.data.cid, 0).then(movies => {
      // 更新当前列表
      this.setData({
        movielist: movies
      })
      // 重新存入缓存
      wx.setStorage({
        data: movies,
        key: this.data.cid + ''
      })
      // 停止下拉刷新效果
      wx.stopPullDownRefresh()
    })
  }
})