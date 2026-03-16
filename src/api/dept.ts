import request from '@/utils/request'

/**
 * 获取部门列表
 */
export function getDeptList(params?: any) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params
  })
}

/**
 * 获取部门树
 */
export function getDeptTree() {
  return request({
    url: '/system/dept/tree',
    method: 'get'
  })
}
