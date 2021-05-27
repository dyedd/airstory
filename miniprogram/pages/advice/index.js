// pages/advice/index.js
const API_KEY = 'b2ba0d400ace457086a4413e91d5df3f'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
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
    this.getLocation()
  },
  showPopup(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      "show": true,
      "id": id
    });
  },

  onClose() {
    this.setData({
      "show": false
    });
  },
  getLocation() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.getCity(`${longitude},${latitude}`)
      }
    })
  },
  getCity(location) {
    let that = this;
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res) {
        // console.log(res.data)
        that.setData({
          locationName: res.data.location[0].name,
          adm2: res.data.location[0].adm2,
        })
        that.getIndices(res.data.location[0].id)
      }
    })
  },
  getIndices(location) {
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/indices/1d',
      data: {
        location: location,
        key: API_KEY,
        type: '1,2,13,16,6,3,15,9'
      },
      success(res) {
        console.log(res.data)
        that.setData({
          "indices": res.data.daily
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
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