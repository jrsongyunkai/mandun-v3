// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* global config */
import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css'
import './assets/fonts/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import i18n from './i18n/i18n'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import func from '@/untils/func'
import '@/untils/height'
import { sessionState, checkLogin } from '@/api/api'
import App from './App'
import store from './store'
import router from './router'
import { createSocket, sendWSPush } from '@/untils/websocket'

Vue.use(ElementUI)
const elScrollBar = (el) => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    el._ps_ = new PerfectScrollbar(el, { suppressScrollX: false })
    el._ps_.update()
  }
}
Vue.directive('preventReClick', {
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 3000)
      }
    })
  }
})
Vue.directive('el_scrollBar', {
  inserted (el, binding) {
    const { arg } = binding
    if (arg === 'scrollBar') {
      el = el.querySelector('.el-table__body-wrapper')
      if (!el) {
        return console.warn('未发现className为el-table__body-wrapper的dom')
      }
    }
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    elScrollBar(el)
  },
  componentUpdated (el, binding, vnode) {
    const { arg } = binding
    if (arg === 'scrollBar') {
      el = el.querySelector('.el-table__body-wrapper')
      if (!el) {
        return console.warn('未发现className为el-table__body-wrapper的dom')
      }
    }
    vnode.context.$nextTick(
      () => {
        try {
          elScrollBar(el)
        } catch (error) {
          console.error(error)
        }
      }
    )
  }
})
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    sessionState({})
      .then((res) => {
        if (res.code === '-1') {
          store.dispatch('reset')
          next({
            path: '/login'
          })
        } else {
          sessionStorage.setItem('token', res.data.token)
          store.commit('innerMessage', res.data.WEBSITE_INNER_MESSAGE)
          if (from.path === '/login') {
            checkLogin({})
              .then(res => {
                const theHead = document.getElementsByTagName('head').item(0)
                const myScript = document.createElement('script')
                myScript.type = 'text/javascript'
                myScript.innerHTML = 'var loginchk = function () {};' + res
                myScript.defer = true
                theHead.appendChild(myScript)
                store.commit('realName', config.realName)
                store.commit('pageCustom', config.pageCustom)
                if (config.useMap === 'BAIDU_OFFLINE') {
                  let script = document.createElement('script')
                  script.type = 'text/javascript'
                  script.src = './baiduMap/baidumap_offline_v2_load.js'
                  document.head.appendChild(script)
                }
                setTimeout(() => {
                  next()
                }, 100)
              })
          } else {
            next()
          }
          if (to.path === '/') {
            next({
              path: '/Home'
            })
          }
          if ('WebSocket' in window) {
            setTimeout(() => {
              new Promise(resolve => {
                createSocket(res.data.token)
                resolve('')
              }).then(() => {
                if (to.path === '/Home' || '/InnerMain/Overview') {
                  let params = {
                    eventType: 2,
                    msgType: 1
                  }
                  sendWSPush(params)
                }
              })
            }, 3000)
          }
        }
        let _tmp = store.state.projectCode
        if (to.path === '/Home') {
          store.commit('projectCode', '')
        } else {
          store.commit('projectCode', _tmp)
        }
      })
  }
})

Vue.prototype.$func = func
Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
