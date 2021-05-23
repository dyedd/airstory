Component({
  data: {
    active:0,
    list:[{
      text:"天气",
      normal:"cloud://airstory-2gfltwcp7e973deb.6169-airstory-2gfltwcp7e973deb-1305977660/weather_normal.png",
      active:"cloud://airstory-2gfltwcp7e973deb.6169-airstory-2gfltwcp7e973deb-1305977660/weather_select.png",
      url:"/pages/index/index"
    },
    {
      text:"空气质量",
      normal:"cloud://airstory-2gfltwcp7e973deb.6169-airstory-2gfltwcp7e973deb-1305977660/quality_normal.png",
      active:"cloud://airstory-2gfltwcp7e973deb.6169-airstory-2gfltwcp7e973deb-1305977660/quality_select.png",
      url:"/pages/quality/index"
    },
    {
      text:"生活建议",
      normal:"cloud://airstory-2gfltwcp7e973deb.6169-airstory-2gfltwcp7e973deb-1305977660/advice_normal.png",
      active:"cloud://airstory-2gfltwcp7e973deb.6169-airstory-2gfltwcp7e973deb-1305977660/advice_select.png",
      url:"/pages/logs/logs"
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