import axios from 'axios'
import qs from 'qs'
import { throwErr } from '@/untils'
import { Message, MessageBox } from 'element-ui'
import router from '../router'
axios.defaults.timeout = 30e3
axios.defaults.baseURL = ''
axios.defaults.withCredentials = true
const CancelToken = axios.CancelToken
const source = CancelToken.source()
let loginAgainFlag = false
/* global ctxPaths */
// request 拦截器
axios.interceptors.request.use(
  config => {
    if (!loginAgainFlag) {
      config.cancelToken = source.token
    } else {
      return config
    }
    return config
  },
  error => { return Promise.reject(error) }
)
// reponse 拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === '-1' && !loginAgainFlag) {
        if (response.request.responseURL.indexOf('/portal/login.as') === -1 && window.location.hash !== '#/') {
          source.cancel()
          MessageBox(response.data.message, '', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
          }).then(() => {
            router.replace({
              path: '/login'
            })
            loginAgainFlag = true
            location.reload()
          }).catch(() => {
            router.replace({
              path: '/login'
            })
            loginAgainFlag = true
            location.reload()
          })
        }
      }
      return Promise.resolve(response.data)
    } else {
      Message({
        message: '出错了'
      })
      return Promise.resolve(response.data)
    }
  },
  error => {
    if (axios.isCancel(error)) { // 取消请求的情况下，终端Promise调用链
      return new Promise(() => {})
    } else if (error && error.response) {
      let res = {}
      res.code = error.response.status
      res.msg = throwErr(error.response.status, error.response)
      // return Promise.reject(res)
      Message({
        message: res.msg
      })
    }
    return Promise.reject(error)
  }
)
console.log(ctxPaths)
export const POST = (url, params) => {
  return axios.post(ctxPaths + `${url}?v=` + new Date().getTime(), qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(res => res)
}

export const POST2 = (url, params) => {
  return axios.post(ctxPaths + `${url}?v=` + new Date().getTime(), params, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(res => res)
}

export const FETCH = (url, params) => {
  return axios.get(ctxPaths + `${url}`, {params: params}).then(res => res)
}

export const PUT = (url, params) => {
  return axios.put(`${url}`, params).then(res => res)
}

export const DELETE = (url, params) => {
  return axios.delete(`${url}`, {params: params}).then(res => res)
}

export const PATCH = (url, params) => {
  return axios.patch(`${url}`, params).then(res => res)
}
