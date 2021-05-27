// index.js
// 获取应用实例
import utils from '../../utils/util';
const app = getApp()
const API_KEY = 'b2ba0d400ace457086a4413e91d5df3f'
Page({
  data: {
  },
  onLoad() {
    let that = this;
    that.getLocation()
  },
  onShow: function () {
    this.getTabBar().init();
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
        that.setData({
          locationName: res.data.location[0].name,
          adm2:res.data.location[0].adm2,
        })
        that.getNowWeather(res.data.location[0].id)
        that.get24Weather(res.data.location[0].id)
        that.get7dWeather(res.data.location[0].id)
        that.getWeatherWarning(res.data.location[0].id)
      }
    })
  },
  getNowWeather(location){
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/weather/now',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res){
        // console.log(res.data)
        // wx.setStorage({
        //   nowWeatherUptime: res.data.updateTime,
        //   nowWeatherData: res.data
        // })
        that.setData({
          now:{
            temp: res.data.now.temp,
            text: res.data.now.text,
            icon: res.data.now.icon,
            windDir: res.data.now.windDir,
            windScale: res.data.now.windScale,
            feelsLike: res.data.now.feelsLike,
            humidity: res.data.now.humidity,
          }
        })
      }
    })
  },
  get24Weather(location) {
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/weather/24h',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res){
        // console.log(res.data)
        res.data.hourly.forEach((item)=>{
          item.time = utils.formatTime(new Date(item.fxTime)).hourly
        })
        that.setData({
          hourly: res.data.hourly
        })
      }
    })
  },
  get7dWeather(location){
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/weather/7d',
      data: {
        'key': API_KEY,
        'location': location
      },
      success(res){
        res.data.daily.forEach((item)=>{
          item.date = utils.formatTime(new Date(item.fxDate)).daily
          item.dateToString = utils.formatTime(new Date(item.fxDate)).dailyToString
          item.text = item[`text${utils.isDayOrNight(item.sunset)}`]
          item.icon = item[`icon${utils.isDayOrNight(item.sunset)}`]
        })
        that.setData({
          daily: res.data.daily
        })
        // console.log(res.data)
      }
    })
    
  },
  getWeatherWarning(location){
    let that = this;
    wx.request({
      url: 'https://api.qweather.com/v7/warning/now',
      data:{
        key: API_KEY,
        location: location
      },
      success(res){
        // console.log(res.data.warning[0])
        that.setData({
          "warning": !res.data.warning[0]?0:res.data.warning[0]
        })
      }
    })
  }
})
