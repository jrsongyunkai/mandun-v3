import store from '@/store'

function setHeight () {
  let _height
  if (window.innerHeight < 969) {
    _height = 969
  } else {
    _height = window.innerHeight
  }
  store.commit('heightGauge', (_height - 309) / 3 - 100)
  store.commit('heightOne', (_height - 309) / 3)
  store.commit('heightSecond', (_height - 309) / 3 - 20 + 'px')
  store.commit('heightThird', ((_height - 309) / 3 - 28) / 2 + 'px')
  store.commit('heightFour', (_height - 309) / 3 + 28)
  store.commit('mapHeight', (_height - 309) / 3 * 2 - 78 + 'px')
  store.commit('innerMainHeight', _height - 143 + 'px')
  store.commit('asideHeight', _height - 243 + 'px')
  store.commit('asideTowHeight', _height - 143 + 'px')
  store.commit('formulaHeight', _height - 203 + 'px')
  store.commit('overHeight', (_height - 143) * 0.6 - 10 + 'px')
  store.commit('overTowHeight', (_height - 143) * 0.4 + 'px')
  store.commit('manageHeight', (_height - 143) * 0.45 + 'px')
  store.commit('consumHeight', (_height - 143) * 0.5 + 'px')
  store.commit('manageTowHeight', (_height - 143) * 0.35 + 'px')
  store.commit('innerComponentHeight', (_height - 293) / 2 + 'px')
  store.commit('innerTableHeight', (_height - 293) / 2 - 70 + 'px')
  store.commit('powerTableHeight', _height - 225 + 'px')
  store.commit('groupTableHeight', _height - 388 + 'px')
  store.commit('controlTableHeight', _height - 380 + 'px')
  store.commit('analysispieHeight', _height - 310 + 'px')
  store.commit('orviboTableHeight', _height - 340 + 'px')
  store.commit('channelsTableHeight', _height - 300 + 'px')
  store.commit('alarmTableHeight', _height - 360 + 'px')
  store.commit('channelsHeight', _height - 350 + 'px')
  store.commit('BuiltInTimingHeight', _height - 340 + 'px')
  store.commit('batchHeight', _height - 326 + 'px')
  store.commit('dialogHeight', _height - 100 + 'px')
  store.commit('uploadHeight', _height - 208)
  store.commit('windowHeight', _height)
}
// 初始化
setHeight()
// 改变窗口大小时重新设置
window.onresize = function () {
  if (document.isFullScreen || document.mozFullScreenElement || document.msFullscreenElement || document.fullScreenElement || document.webkitIsFullScreen) {
    store.commit('mapHeight', (window.innerHeight - 185) + 'px')
    return false
  }
  setHeight()
}
