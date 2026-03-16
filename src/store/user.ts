import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  roles: string[]
  permissions: string[]
  userInfo: {
    username: string
    nickname: string
    avatar: string
  } | null
}

/**
 * 用户状态存储
 * 处理 Token 持久化与基本信息获取
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    roles: [],
    permissions: [],
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
     * 获取用户信息
     */
    async getInfo() {
      // 模拟获取权限信息
      // 在实际项目中，这里会从后台获取
      this.roles = ['admin']
      this.permissions = ['*'] // '*' 代表超级管理员权限
      this.userInfo = {
        username: 'admin',
        nickname: '超级管理员',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
      return { roles: this.roles, permissions: this.permissions }
    },
    /**
     * 登出
     */
    logout() {
      this.token = null
      this.roles = []
      this.permissions = []
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})
