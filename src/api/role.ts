import request from '@/utils/request'

/**
 * 获取角色列表
 */
export function getRoleList(params: any) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params
  })
}

/**
 * 获取角色菜单权限
 */
export function getRoleMenuIds(roleId: number) {
  return request({
    url: `/system/role/menu/${roleId}`,
    method: 'get'
  })
}

/**
 * 修改角色状态
 */
export function changeRoleStatus(id: number, status: number) {
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: { id, status }
  })
}

/**
 * 新增角色
 */
export function addRole(data: any) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 */
export function updateRole(data: any) {
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}

/**
 * 删除角色
 */
export function deleteRole(roleId: number) {
  return request({
    url: `/system/role/${roleId}`,
    method: 'delete'
  })
}

