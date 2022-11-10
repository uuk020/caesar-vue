import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import storage from './storage'
import qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000 
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (storage.get('token')) {
      config.headers['Authorization'] = "Bearer " + storage.get('token')
    }
    if (config.method === 'post' || config.method === 'put') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use( 
  response => {
    const res = response.data
    return res
  },
  error => {
    const status = error.response.status
    const message = error.response.data.message
    if (status !== 200) {
      Message({
        message: message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (status === 401 || status === 403) {
      MessageBox.confirm('你已经退出了，你可以取消以保持在这个页面上，或者重新登录', '确认退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        storage.remove('token')
        window.location.href = '/login'
      })
    }
    return Promise.reject(error)
  }
)

export default service// request interceptor
