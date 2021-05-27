// pages/quality/index.js
const API_KEY = 'b2ba0d400ace457086a4413e91d5df3f'
import util from '../../utils/util'
import * as echarts from '../../ec-canvas/echarts'; 
let chart = null;
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '正面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [120, 102, 141, 174, 190, 250, 220],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '负面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: [-20, -32, -21, -34, -90, -130, -110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

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
    ec:{
      onInit: initChart
    }
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
          "updateTime": util.formatTime(new Date(res.data.updateTime)).hourly,
          "quailty":{
            "co":that.judgeRange(res.data.now.co),
            "no2":that.judgeRange(res.data.now.no2),
            "o3":that.judgeRange(res.data.now.o3),
            "pm2p5":that.judgeRange(res.data.now.pm2p5),
            "pm10":that.judgeRange(res.data.now.pm10),
            "so2":that.judgeRange(res.data.now.so2),
          }
        })
      }
    })
  },
  judgeRange(v){
    if(v>=0&&v<=50) return 1;
    if(v>=51&&v<=100) return 2;
    if(v>=101&&v<=150) return 3;
    if(v>=151&&v<=200) return 4;
    if(v>=201&&v<=300) return 5;
    if(v>=301&&v<=500) return 6;
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
    setTimeout(function () {
      // 获取 chart 实例的方式
      console.log(chart)
    }, 2000);
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