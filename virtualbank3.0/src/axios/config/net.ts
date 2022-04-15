import axios from 'axios'
import { Notify } from 'vant'
import config from './axios.config'

// 使用自定义配置新建axios实例
const instance = axios.create(config)

export const instance2 = axios.create(config)
instance.interceptors.request.use(
  (config: any) => {
    // 在发送请求之前做些什么
    // 判断是否存在token,如果存在将每个页面header添加token
    if (sessionStorage.getItem('token')) {
      config.headers.Authorization = sessionStorage.getItem('token')
      config.headers.token = sessionStorage.getItem('token')
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 添加响应拦截器
instance.interceptors.response.use(
  (value) => {
    // 对响应数据做点什么
    if (value.data.code === '000000') {
      return value.data.data || true
    }
    Notify({
      type: 'warning',
      message: value.data.msg || '芭比Q了',
    })
    return null
  },
  (error) =>
    // 对响应错误做点什么
    // Notify({
    //   type: 'danger',
    //   message: '服务器开小差了！',
    // })
    Promise.reject(null)
)

export default instance
