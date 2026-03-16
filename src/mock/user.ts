import { MockMethod } from 'vite-plugin-mock'

/**
 * 模拟内存数据库
 * 在 Vite 运行期间，这些数据会保存在变量中，从而实现增删改后的持久感
 */
let userList = Array.from({ length: 50 }).map((_, index) => ({
  id: index + 1,
  username: `user_${index + 1}`,
  nickname: `用户_${index + 1}`,
  role: index % 2 === 0 ? 'admin' : 'visitor',
  email: `test${index}@lighthouse.com`,
  status: index % 3 === 0 ? 0 : 1,
  createTime: '2024-03-16 10:00:00'
}))

export default [
  // 登录
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: { token: 'mock-token-admin', roles: ['admin'], username: '超级管理员' },
          message: '登录成功'
        }
      }
      return { code: 500, message: '用户名或密码错误' }
    }
  },
  // 获取列表 (支持搜索和分页)
  {
    url: '/api/user/list',
    method: 'get',
    response: (config: any) => {
      const { username, page = 1, pageSize = 10 } = config.query
      const filteredList = userList.filter(item => 
        !username || item.username.includes(username) || item.nickname.includes(username)
      )
      return {
        code: 200,
        data: {
          total: filteredList.length,
          list: filteredList.slice((page - 1) * pageSize, page * pageSize)
        }
      }
    }
  },
  // 新增
  {
    url: '/api/user/add',
    method: 'post',
    response: ({ body }: any) => {
      const newUser = {
        ...body,
        id: userList.length > 0 ? Math.max(...userList.map(u => u.id)) + 1 : 1,
        createTime: new Date().toLocaleString(),
        status: 1
      }
      userList.unshift(newUser) // 插到开头
      return { code: 200, message: '新增成功' }
    }
  },
  // 修改
  {
    url: '/api/user/update',
    method: 'put',
    response: ({ body }: any) => {
      const index = userList.findIndex(u => u.id === body.id)
      if (index !== -1) {
        userList[index] = { ...userList[index], ...body }
        return { code: 200, message: '修改成功' }
      }
      return { code: 500, message: '用户不存在' }
    }
  },
  // 删除
  {
    url: /^\/api\/user\/delete\/\d+$/,
    method: 'delete',
    response: (config: any) => {
      const id = parseInt(config.url.split('/').pop())
      userList = userList.filter(u => u.id !== id)
      return { code: 200, message: '删除成功' }
    }
  },
  // 批量删除
  {
    url: '/api/user/batch-delete',
    method: 'delete',
    response: ({ body }: any) => {
      const { ids } = body
      userList = userList.filter(u => !ids.includes(u.id))
      return { code: 200, message: '批量删除成功' }
    }
  }
] as MockMethod[]
