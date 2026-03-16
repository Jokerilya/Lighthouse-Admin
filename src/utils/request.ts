import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

/**
 * Axios 响应数据基础接口
 */
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 定义 Loading 实例
let loadingInstance: any = null

/**
 * 封装 Axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    nprogress.start()
    
    // 如果配置中开启了 loading
    if ((config as any).loading) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0.7)',
      })
    }

    // 此处可注入 Token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    nprogress.done()
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    nprogress.done()
    if (loadingInstance) loadingInstance.close()

    const { code, data, message } = response.data

    // 根据后端约定的状态码处理
    if (code === 200) {
      return data
    } else {
      ElMessage.error(message || '服务异常')
      // 401: Token 过期
      if (code === 401) {
        localStorage.clear()
        window.location.href = '/#/login'
      }
      return Promise.reject(new Error(message || 'Error'))
    }
  },
  (error) => {
    nprogress.done()
    if (loadingInstance) loadingInstance.close()
    
    const message = error.response?.data?.message || error.message || '网络错误'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service
