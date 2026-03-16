import request from '@/utils/request'

/**
 * 获取任务列表
 */
export function getTodoList() {
  return request({
    url: '/todo/list',
    method: 'get'
  })
}

/**
 * 更新任务状态或排序
 */
export function updateTodo(data: any) {
  return request({
    url: '/todo/update',
    method: 'put',
    data
  })
}

/**
 * 新增任务
 */
export function addTodo(data: any) {
  return request({
    url: '/todo/add',
    method: 'post',
    data
  })
}

/**
 * 删除任务
 */
export function deleteTodo(id: number) {
  return request({
    url: `/todo/delete/${id}`,
    method: 'delete'
  })
}
