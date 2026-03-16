import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

/**
 * 模拟内存数据库
 */
let userList = Array.from({ length: 50 }).map((_, index) => {
  return {
    id: index + 1,
    username: Mock.Random.last().toLowerCase() + (index + 1),
    nickname: Mock.Random.cname(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
    role: index === 0 ? 'admin' : (index % 5 === 0 ? 'admin' : 'common'),
    email: Mock.Random.email('lighthouse.com'),
    status: Mock.Random.integer(0, 1),
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }
})

export default [
  // 获取列表
  {
    url: '/api/user/list',
    method: 'get',
    response: (config: any) => {
      const { username, page = 1, pageSize = 10 } = config.query || {}
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
        createTime: Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1
      }
      userList.unshift(newUser)
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
    url: '/api/user/delete', // 简单处理，或者用通配符
    method: 'delete',
    response: () => {
      return { code: 200, message: '删除成功' }
    }
  },
  // 批量删除
  {
    url: '/api/user/batch-delete',
    method: 'delete',
    response: ({ body }: any) => {
      const { ids } = body || {}
      userList = userList.filter(u => !ids.includes(u.id))
      return { code: 200, message: '批量删除成功' }
    }
  }
] as MockMethod[]
