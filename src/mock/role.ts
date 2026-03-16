import { MockMethod } from 'vite-plugin-mock'

// 模拟角色数据
let roleList = [
  {
    id: 1,
    roleName: '超级管理员',
    roleKey: 'admin',
    roleSort: 1,
    status: 1,
    remark: '拥有系统所有管理权限',
    createTime: '2024-01-01 10:00:00',
    menuIds: [1, 2, 100, 1000, 1001, 1002, 1003, 101, 102, 103, 104, 3, 300, 301, 4]
  },
  {
    id: 2,
    roleName: '普通员工',
    roleKey: 'common',
    roleSort: 2,
    status: 1,
    remark: '仅拥有业务模块查看和操作权限',
    createTime: '2024-02-15 10:00:00',
    menuIds: [1, 3, 300, 301, 4]
  },
  {
    id: 3,
    roleName: '访客',
    roleKey: 'guest',
    roleSort: 3,
    status: 1,
    remark: '仅拥有系统查看权限',
    createTime: '2024-03-01 10:00:00',
    menuIds: [1]
  }
]

export default [
  // 获取角色列表
  {
    url: '/api/system/role/list',
    method: 'get',
    response: (config: any) => {
      const { roleName, roleKey, status, page = 1, pageSize = 10 } = config.query
      const filtered = roleList.filter(item => 
        (!roleName || item.roleName.includes(roleName)) &&
        (!roleKey || item.roleKey.includes(roleKey)) &&
        (status === undefined || item.status === Number(status))
      )
      return {
        code: 200,
        data: {
          total: filtered.length,
          list: filtered.slice((page - 1) * pageSize, page * pageSize)
        }
      }
    }
  },
  // 获取特定角色的菜单权限
  {
    url: /^\/api\/system\/role\/menu\/\d+$/,
    method: 'get',
    response: (config: any) => {
      const id = parseInt(config.url.split('/').pop() || '0')
      const role = roleList.find(r => r.id === id)
      return {
        code: 200,
        data: role ? role.menuIds : []
      }
    }
  },
  // 修改角色状态
  {
    url: '/api/system/role/changeStatus',
    method: 'put',
    response: ({ body }: any) => {
      const { id, status } = body
      const index = roleList.findIndex(r => r.id === id)
      if (index !== -1) {
        roleList[index].status = status
        return { code: 200, message: '状态更新成功' }
      }
      return { code: 500, message: '角色不存在' }
    }
  },
  // 删除角色
  {
    url: /^\/api\/system\/role\/\d+$/,
    method: 'delete',
    response: (config: any) => {
      const id = parseInt(config.url.split('/').pop() || '0')
      const index = roleList.findIndex(r => r.id === id)
      if (index !== -1) {
        roleList.splice(index, 1)
        return { code: 200, message: '删除成功' }
      }
      return { code: 500, message: '角色不存在' }
    }
  },
  // 新增角色
  {
    url: '/api/system/role',
    method: 'post',
    response: ({ body }: any) => {
      const newId = roleList.length > 0 ? Math.max(...roleList.map(r => r.id)) + 1 : 1
      const newRole = {
        ...body,
        id: newId,
        createTime: new Date().toISOString().replace('T', ' ').split('.')[0]
      }
      roleList.push(newRole)
      return { code: 200, message: '新增成功' }
    }
  },
  // 修改角色
  {
    url: '/api/system/role',
    method: 'put',
    response: ({ body }: any) => {
      const index = roleList.findIndex(r => r.id === body.id)
      if (index !== -1) {
        roleList[index] = { ...roleList[index], ...body }
        return { code: 200, message: '修改成功' }
      }
      return { code: 500, message: '角色不存在' }
    }
  }
] as MockMethod[]

