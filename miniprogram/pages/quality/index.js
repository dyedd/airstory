// pages/quality/index.js
const API_KEY = 'b2ba0d400ace457086a4413e91d5df3f'
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
    activeName: '1',
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
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
        that.getAirNow(res.data.location[0].id)
        that.get5dAir(res.data.location[0].id)
      }
    })
  },
  getAirNow(location) {
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/air/now',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res) {
        console.log(res.data)
        that.setData({
          "airData": res.data.now,
          "airText": that.judgeRange(res.data.now.aqi)>=201?"请戴好口罩出门":"今天的空气可以不用携带口罩，但疫情防护也要做好准备哦",
          "updateTime": util.formatTime(new Date(res.data.updateTime)).hourly,
          "quailty": {
            "co": that.judgeRange(res.data.now.co),
            "no2": that.judgeRange(res.data.now.no2),
            "o3": that.judgeRange(res.data.now.o3),
            "pm2p5": that.judgeRange(res.data.now.pm2p5),
            "pm10": that.judgeRange(res.data.now.pm10),
            "so2": that.judgeRange(res.data.now.so2),
          }
        })
      }
    })
  },
  judgeRange(v) {
    v=parseInt(v)
    if (v >= 0 && v <= 50) return 1;
    if (v >= 51 && v <= 100) return 2;
    if (v >= 101 && v <= 150) return 3;
    if (v >= 151 && v <= 200) return 4;
    if (v >= 201 && v <= 300) return 5;
    if (v >= 301 && v <= 500) return 6;
  },
  get5dAir(location) {
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/air/5d',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res) {
        res.data.daily.forEach((item) => {
          item.time = util.formatTime(new Date(item.fxDate)).daily
          //截取等级前两个字
          item.badge = item.category.slice(0, 2)
          switch (item.level) {
            case "1":
              item.color = '#95B359'
              break;
            case "2":
              item.color = '#D3CF63'
              break;
            case "3":
              item.color = '#E0991D'
              break;
            case "4":
              item.color = '#D96161'
              break;
            case "5":
              item.color = '#A257D0'
              break;
            case "6":
              item.color = '#D94371'
              break;

          }
        })
        console.log(res.data)
        that.setData({
          "air5dData": res.data.daily,
        })
      }
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