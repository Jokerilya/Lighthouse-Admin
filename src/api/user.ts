import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(params: any) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

/**
 * 新增用户
 */
export function addUser(data: any) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 */
export function updateUser(data: any) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除用户
 */
export function batchDeleteUser(ids: number[]) {
  return request({
    url: '/user/batch-delete',
    method: 'delete',
    data: { ids }
  })
}
