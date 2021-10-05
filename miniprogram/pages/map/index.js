// pages/map/index.js
const QQMapWX = require("../../utils/qqmap-wx-jssdk.min");
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
let qqmapsdk;
const API_KEY = 'b2ba0d400ace457086a4413e91d5df3f'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:""
  },
  onChange(event) {
    this.setData({
      value: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '3SHBZ-ECH3F-4R7JB-J4LD5-3ELCS-ULBQC'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
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

  },
  getLocation() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.reverseGeocoder(`${latitude},${longitude}`)
      }
    })
  },
  getAirNow(location) {
    let that = this;
    return new Promise((resolve) => {
      wx.request({
        url: 'https://api.qweather.com/v7/air/now',
        data: {
          'key': API_KEY,
          'location': location
        },
        success(res) {
          // console.log(res.data.now.aqi)
          resolve(res.data.now.aqi)
        }
      })
    })
  },
  reverseGeocoder(location) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      location: location || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) { //成功后的回调
        // console.log(res);
        var res = res.result;
        var mks = [];
        for (let i = 0; i < res.pois.length; i++) {
          _this.getAirNow(`${res.pois[i].location.lng},${res.pois[i].location.lat}`).then(data => {
            mks.push({ // 获取返回结果，放到mks数组中
              title: res.pois[i]['address'],
              id: res.pois[i].id,
              latitude: res.pois[i].location.lat,
              longitude: res.pois[i].location.lng,
              iconPath: '../../images/placeholder.png', //图标路径
              width: 20,
              height: 20,
              callout: { //在markers上展示地址名称，根据需求是否需要
                content: data,
                color: '#000',
                display: 'ALWAYS'
              }
            })
            _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
              markers: mks,
              poi: {
                latitude: res.pois[i].location.lat,
                longitude: res.pois[i].location.lng
              }
            })
          })
          }
      },
      fail: function (error) {
        Toast.fail(error.message);
      },
      complete: function (res) {
        // console.log(res);
        // if(res.status != 0) {
        //   Toast.fail(res.message);
        // }
      }
    })
  },
  geocoder() {
    var _this = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: _this.data.value, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) { //成功后的回调
        // console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.getAirNow(`${res.location.lng},${res.location.lat}`).then(data=>{
          _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
            markers: [{
              id: 0,
              title: res.title,
              latitude: latitude,
              longitude: longitude,
              iconPath: '../../images/placeholder.png', //图标路径
              width: 20,
              height: 20,
              callout: { //可根据需求是否展示经纬度
                content: data,
                color: '#000',
                display: 'ALWAYS'
              }
            }],
            poi: { //根据自己data数据设置相应的地图中心坐标变量名称
              latitude: latitude,
              longitude: longitude
            }
          });
        })
        
      },
      fail: function (error) {
        Toast.fail(error.message);
      },
      complete: function (res) {
        // console.log(res);
        // Toast.success(res。);
        Toast.success(`匹配度：${res.result.similarity}`);
      }
    })
  }
})