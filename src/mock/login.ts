import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/login',
    method: 'post',
    response: (config: any) => {
      const { username, password } = config.body || {}
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: { 
            token: 'mock-token-admin', 
            roles: ['admin'], 
            username: '超级管理员' 
          },
          message: '登录成功'
        }
      }
      return { code: 500, message: '用户名或密码错误' }
    }
  }
] as MockMethod[]
