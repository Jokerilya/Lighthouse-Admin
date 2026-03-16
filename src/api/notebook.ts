import request from '@/utils/request'

/**
 * 获取周报列表
 */
export function getNotebookList() {
  return request({
    url: '/notebook/list',
    method: 'get'
  })
}

/**
 * 保存周报 (支持新增和更新)
 */
export function saveNotebook(data: any) {
  return request({
    url: '/notebook/save',
    method: 'post',
    data
  })
}

/**
 * 删除周报
 */
export function deleteNotebook(id: number) {
  return request({
    url: `/notebook/delete/${id}`,
    method: 'delete'
  })
}
