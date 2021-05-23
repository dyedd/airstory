const formatTime = date => {
  // const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()
  const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
  return {
    hourly: [hour, minute].map(formatNumber).join(":"),
    daily: [month, day].map(formatNumber).join("-"),
    dailyToString: isToday ? "今天" : weekArray[date.getDay()]
  }
}
const isDayOrNight = date =>{
  const hour = date.split(":")[0]
  const minute = date.split(":")[1]
  return new Date().setHours(hour,minute) >= new Date().getTime()?"Day":"Night"
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  isDayOrNight
}