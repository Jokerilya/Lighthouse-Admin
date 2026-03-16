import request from '@/utils/request'

/**
 * 获取菜单列表
 */
export function getMenuList(params?: any) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params
  })
}

/**
 * 获取路由菜单
 */
export function getRouters() {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
