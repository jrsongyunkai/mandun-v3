import { Message } from 'element-ui'
import i18n from '../i18n/i18n'
export default {
  getNowFormatDate () {
    let date = new Date()
    let seperator = '-'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    let currentDate = year + seperator + month + seperator + strDate
    return currentDate
  },
  getCurrentYearMonth () {
    let date = new Date()
    let seperator = '-'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    let current = year + seperator + month
    return current
  },
  getFuTime (date, time) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (time === 'month') {
      return year + '-' + month
    } else if (time === 'date') {
      return year + '-' + month + '-' + strDate
    } else if (time === 'hour') {
      return year + '-' + month + '-' + strDate + ' ' + hour
    } else if (time === 'year') {
      return year + ''
    }
  },
  getYearMonth (date, time) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (time === 'year') {
      return year + ''
    } else if (time === 'all') {
      return year + '-' + month
    } else if (time === 'month') {
      return month + ''
    }
  },
  getNowFormatDateTime (e) {
    let date = new Date()
    let seperator = '-'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    if (e === 'time') {
      let currentDate = [hour, minute, second].join(':')
      return currentDate
    } else {
      let currentDate = year + seperator + month + seperator + strDate + ' ' + [hour, minute, second].join(':')
      return currentDate
    }
  },
  formatDate (format, time) {
    let date = new Date(time)
    let seperator = '-'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    let formatDate
    if (format === 'yyyy-MM-dd HH:mm:ss') {
      formatDate = year + seperator + month + seperator + strDate + ' ' + [hour, minute, second].join(':')
    } else if (format === 'yyyy-MM-dd') {
      formatDate = year + seperator + month + seperator + strDate
    } else if (format === 'HH:mm') {
      formatDate = [hour, minute].join(':')
    } else if (format === 'yyyy-MM-dd HH') {
      formatDate = year + seperator + month + seperator + strDate + ' ' + hour
    }
    return formatDate
  },
  getDaysBetween (dateString1, dateString2) {
    let startDate = dateString1
    let endDate = dateString2
    let days = Math.floor((endDate - startDate) / (1 * 24 * 60 * 60 * 1000))
    return days
  },
  getMonthText (date) {
    if (!date) return
    let monthText = date.split('-')[1]
    let _lang = localStorage.getItem('locale')
    if (monthText === '01') {
      if (_lang === 'zh') {
        return '一月'
      } else if (_lang === 'en') {
        return 'January'
      }
    }
    if (monthText === '02') {
      if (_lang === 'zh') {
        return '二月'
      } else if (_lang === 'en') {
        return 'February'
      }
    }
    if (monthText === '03') {
      if (_lang === 'zh') {
        return '三月'
      } else if (_lang === 'en') {
        return 'March'
      }
    }
    if (monthText === '04') {
      if (_lang === 'zh') {
        return '四月'
      } else if (_lang === 'en') {
        return 'April'
      }
    }
    if (monthText === '05') {
      if (_lang === 'zh') {
        return '五月'
      } else if (_lang === 'en') {
        return 'May'
      }
    }
    if (monthText === '06') {
      if (_lang === 'zh') {
        return '六月'
      } else if (_lang === 'en') {
        return 'June'
      }
    }
    if (monthText === '07') {
      if (_lang === 'zh') {
        return '七月'
      } else if (_lang === 'en') {
        return 'July'
      }
    }
    if (monthText === '08') {
      if (_lang === 'zh') {
        return '八月'
      } else if (_lang === 'en') {
        return 'August'
      }
    }
    if (monthText === '09') {
      if (_lang === 'zh') {
        return '九月'
      } else if (_lang === 'en') {
        return 'September'
      }
    }
    if (monthText === '10') {
      if (_lang === 'zh') {
        return '十月'
      } else if (_lang === 'en') {
        return 'October'
      }
    }
    if (monthText === '11') {
      if (_lang === 'zh') {
        return '十一月'
      } else if (_lang === 'en') {
        return 'November'
      }
    }
    if (monthText === '12') {
      if (_lang === 'zh') {
        return '十二月'
      } else if (_lang === 'en') {
        return 'December'
      }
    }
  },
  checkDateOneYear (start, end) {
    let diff = new Date(end).getTime() - new Date(start).getTime() - (366 * 24 * 60 * 60 * 1000)
    let result = diff <= 0 ? 'true' : 'false'
    return result
  },
  checkDateOneMonth (start, end) {
    let diff = new Date(end).getTime() - new Date(start).getTime() - (30 * 24 * 60 * 60 * 1000)
    let result = diff <= 0 ? 'true' : 'false'
    return result
  },
  checkPhone (phone) {
    let tel = /^(\+?[0-9]{2,4}-)?[0-9]{2,15}$/
    if (tel.test(phone)) {
      return phone
    }
  },
  checkDateThreeMonths (start, end) {
    let diff = new Date(end).getTime() - new Date(start).getTime() - (91 * 24 * 60 * 60 * 1000)
    let result = diff <= 0 ? 'true' : 'false'
    return result
  },
  checkDataType (val) {
    return val === undefined || val === ''
  },
  globalizationAlarmTypes (type) {
    switch (type) {
      case '短路报警':
        type = 'types.shortCircuitA'
        break
      case '漏电报警':
        type = 'types.leakageA'
        break
      case '过压报警':
        type = 'types.overpressureA'
        break
      case '过载报警':
        type = 'types.overloadA'
        break
      case '过流报警':
        type = 'types.overcurrentA'
        break
      case '欠压报警':
        type = 'types.undervoltageA'
        break
      case '温度报警':
        type = 'types.temperatureA'
        break
      case '温度预警':
        type = 'types.temperatureW'
        break
      case '浪涌报警':
        type = 'types.surgeA'
        break
      case '电弧报警':
        type = 'types.fireA'
        break
      case '漏保功能正常':
        type = 'types.leakageProtectionNormal'
        break
      case '漏电保护功能正常':
        type = 'types.leakageProtectionNormal'
        break
      case '漏保自检未完成':
        type = 'types.leakageProtectionSelfTestNotCompleted'
        break
      case '漏电保护自检未完成':
        type = 'types.leakageProtectionSelfTestNotCompleted'
        break
      case '漏电预警':
        type = 'types.leakageW'
        break
      case '电流预警':
        type = 'types.currentW'
        break
      case '过压预警':
        type = 'types.overpressureW'
        break
      case '欠压预警':
        type = 'types.undervoltageW'
        break
      case '通讯预警':
        type = 'types.communicationA'
        break
      case '缺相报警':
        type = 'types.missingPhaseA'
        break
      case '三相相序报警':
        type = 'types.threePhaseSequenceA'
        break
      case '三相负载不平衡报警':
        type = 'types.threePhaseImbalanceA'
        break
      case '离线报警':
        type = 'types.offlineA'
        break
      case '组态报警':
        type = 'types.configureA'
        break
      case '掉电报警':
        type = 'types.powerFailureA'
        break
      case '开箱报警':
        type = 'types.unpackingA'
        break
      case '联动报警':
        type = 'types.linkageA'
        break
      case '烟气报警':
        type = 'types.smokeA'
        break
      case '压强报警':
        type = 'types.pressureA'
        break
      case '液位报警':
        type = 'types.liquidLevelA'
        break
      case '分闸警示':
        type = 'types.openingW'
        break
      case '合闸警示':
        type = 'types.closingW'
        break
      case '异常分闸':
        type = 'types.abnormalOpening'
        break
      case '湿度报警':
        type = 'types.humidityA'
        break
    }
    return type
  },
  routeWhiteList () {
    return ['/']
  },
  windowCountDown (url) {
    let TIME_COUNT = 59
    let count = TIME_COUNT
    let myWindow = window.open('', '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, titlebar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=400, height=400')
    myWindow.document.write(`<div style="text-align: center;margin-top: 160px;font-size: 20px"><p>请导出成功后再关闭此页面!</p><p>页面<span id="count-down">${count}</span>秒后自动关闭</p></div>`)
    myWindow.location.href = url
    let windowTime = setInterval(() => {
      if (count > 0 && count <= TIME_COUNT) {
        count--
        myWindow.document.getElementById('count-down').innerHTML = count
      } else {
        myWindow.close()
        clearInterval(windowTime)
        windowTime = null
      }
    }, 1000)
  },
  BD09_To_GCJ02 (lat, lng) {
    var xPi = 3.14159265358979324 * 3000.0 / 180.0
    var x = lng - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi)
    var lngs = z * Math.cos(theta)
    var lats = z * Math.sin(theta)
    return {lng: lngs, lat: lats}
  },
  GCJ02_To_BD09 (lat, lng) {
    var xPi = 3.14159265358979324 * 3000.0 / 180.0
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPi)
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPi)
    var lngs = z * Math.cos(theta) + 0.0065
    var lats = z * Math.sin(theta) + 0.006
    return {lng: lngs, lat: lats}
  },
  setCookie (name, value) {
    let days = 30
    let exp = new Date()
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  },
  getCookie (name) {
    let _cookie = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
    return _cookie ? _cookie[2] : null
  },
  controlAuthority (power) {
    if (power === 'false') {
      Message.error(i18n.t('message.noOperatingRights'))
    }
  }
}
