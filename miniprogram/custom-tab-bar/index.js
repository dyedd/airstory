Component({
  data: {
    active:0,
    list:[{
      text:"天气",
      normal:"../images/weather_normal.png",
      active:"../images/weather_select.png",
      url:"/pages/index/index"
    },
    {
      text:"空气质量",
      normal:"../images/quality_normal.png",
      active:"../images/quality_select.png",
      url:"/pages/quality/index"
    },
    {
      text:"生活建议",
      normal:"../images/advice_normal.png",
      active:"../images/advice_select.png",
      url:"/pages/advice/index"
    },
  ]
  },
  methods: {
    onChange:function(e){
      const i = e.detail;
      wx.switchTab({
        url: this.data.list[i].url,
      })
      this.setData({
        active : i
      })
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
     　  active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
     }
  }
})