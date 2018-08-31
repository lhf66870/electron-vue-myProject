import axios from 'axios'
import {
  Message
} from 'iview'
// 创建axios实例
const service = axios.create({
  withCredentials: true,
  baseURL: process.env.NODE_ENV !== 'production' ? 'http://test.weifenghr.com' : 'https://yun.weifenghr.com',
  timeout: 15000 // 请求超时时间
})

service.interceptors.request.use(config => {
  // config.headers['Accept'] = 'application/json'
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  },
  error => {
    if (error.response) {
      const res = error.response.data

      return Promise.reject(res)
    } else {
      return Promise.reject(error)
    }
  }
)

export default service
