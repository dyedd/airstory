const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
  return {
    hourly: [hour, minute].map(formatNumber).join(":"),
    daily: [month, day].map(formatNumber).join("-"),
    dailyToString: isToday ? "今天" : weekArray[date.getDay()]
  }
}
const isDayOrNight = date => {
  const hour = date.split(":")[0]
  const minute = date.split(":")[1]
  return new Date().setHours(hour, minute) >= new Date().getTime() ? "Day" : "Night"
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const formatCity = n => {
  const city = ['北京', '成都', '大连', '佛山', '福州', '广州', '哈尔滨', '杭州', '合肥', '济南', '昆明', '南京', '南通', '宁波', '莆田', '青岛', '厦门', '上海', '深圳', '苏州', '天津', '武汉', '西安', '香港', '扬州', '长春', '长沙', '郑州', '中山', '珠海']
  return city.indexOf(n)
}
const formatYesterday = () => {
  // yyyyMMdd
  // 20200531
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1
  let getDate = date.getDate() - 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (getDate >= 0 && getDate <= 9) {
    getDate = "0" + getDate;
  }
  return `${year}${month}${getDate}`;
}
module.exports = {
  formatTime,
  isDayOrNight,
  formatCity,
  formatYesterday
}