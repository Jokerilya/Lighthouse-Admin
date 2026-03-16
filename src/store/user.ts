import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  userInfo: {
    username: string
    nickname: string
    avatar: string
    roles: string[]
  } | null
}

/**
 * 用户状态存储
 * 处理 Token 持久化与基本信息获取
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    userInfo: null
  }),
  actions: {
    /**
     * 设置用户信息
     */
    setUserInfo(info: any) {
      this.userInfo = info
    },
    /**
     * 登录
     */
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    /**
     * 登出
     */
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})
