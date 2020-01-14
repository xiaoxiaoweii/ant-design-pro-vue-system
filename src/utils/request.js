import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { openid } from '@/api/common'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }

    if (error.response.status === 500) {
      notification.error({
        message: '服务端',
        description: error.message
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['businessToken'] = token // 让每个请求携带自定义 token
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
  if (response.data.status && !['0', 200].includes(response.data.status)) {
    if (response.data.status === '2') {
      openid({flag: 0}).then(res => {
        notification.error({
          message: '提示',
          description: '登录失效，正在跳转登录页, 请稍等！'
        })
        Vue.ls.remove(ACCESS_TOKEN)
        setTimeout(() => {
          window.location.href = res
        }, 3000)
      })
    } else {
      notification.error({
        message: '提示',
        description: response.data.msg || '异常错误, 请联系管理员！'
      })
    }
  } else if (!response.data) {
    notification.error({
      message: '提示',
      description: response.data.msg || '异常错误, 请联系管理员！'
    })
  }
  
  localStorage.setItem('FILE_NAME', response.headers['content-disposition'])
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
