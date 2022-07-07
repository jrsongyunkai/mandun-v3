/* global BMap */
/* global google */
export function Map (ak, type) {
  return new Promise(function (resolve, reject) {
    if (type === 'BAIDU' && typeof BMap !== 'undefined') {
      window.onload = function () {
        resolve(window.BMap)
        return true
      }
    } else if (type === 'GOOGLE' && typeof google !== 'undefined') {
      window.onload = function () {
        resolve(google)
        return true
      }
    }
    window.bMapInit = function () {
      resolve(window.BMap)
    }
    window.gMapInit = function () {
      resolve(google)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    if (type === 'BAIDU') {
      script.src = document.location.protocol + '//api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=bMapInit'
    } else if (type === 'GOOGLE') {
      script.src = document.location.protocol + '//maps.googleapis.com/maps/api/js?v=3.27&key=' + ak + '&callback=gMapInit'
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}
