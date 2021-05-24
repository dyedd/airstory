// pages/quality/index.js
const API_KEY = 'cc5e9d1087ca4a4bbbdc72f5ce990ca7'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 25,
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff', 
      backgroundColor: '#041D3B', 
    })
    this.getLocation()
  },
  getLocation(){
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.getCity(`${longitude},${latitude}`)
      }
     })
  },
  getCity(location){
    let that=this;
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res){
        // console.log(res.data)
        that.getAirNow(res.data.location[0].id)
      }
    })
  },
  getAirNow(location){
    let that = this;
    wx.request({
      url: 'https://devapi.qweather.com/v7/air/now',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res){
        console.log(res.data)
        that.setData({
          "airData": res.data.now,
          "updateTime": util.formatTime(new Date(res.data.updateTime)).hourly
        })
      }
    })
  },
  get5dAir(location){
    wx.request({
      url: 'url',
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