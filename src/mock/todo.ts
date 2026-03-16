import { MockMethod } from 'vite-plugin-mock'

let todoList = [
  { id: 1, content: '完成 Lighthouse Admin 架构搭建', status: 1, priority: 'high', createTime: '2024-03-16' },
  { id: 2, content: '用户管理模块 CRUD 客制化', status: 1, priority: 'medium', createTime: '2024-03-16' },
  { id: 3, content: '集成 vue-draggable-plus 拖拽排序', status: 0, priority: 'high', createTime: '2024-03-16' },
  { id: 4, content: 'Markdown 记事本开发', status: 0, priority: 'medium', createTime: '2024-03-16' },
  { id: 5, content: 'ECharts 仪表盘动态适配', status: 0, priority: 'low', createTime: '2024-03-16' }
]

export default [
  {
    url: '/api/todo/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: todoList,
        message: '成功'
      }
    }
  },
  {
    url: '/api/todo/add',
    method: 'post',
    response: ({ body }: any) => {
      const newTodo = {
        ...body,
        id: todoList.length > 0 ? Math.max(...todoList.map(t => t.id)) + 1 : 1,
        status: 0,
        createTime: new Date().toLocaleDateString()
      }
      todoList.unshift(newTodo)
      return { code: 200, message: '添加成功' }
    }
  },
  {
    url: '/api/todo/update',
    method: 'put',
    response: ({ body }: any) => {
      // 如果是全量更新（拖拽排序后）
      if (Array.isArray(body)) {
        todoList = body
        return { code: 200, message: '更新成功' }
      }
      // 单条更新状态
      const index = todoList.findIndex(t => t.id === body.id)
      if (index !== -1) {
        todoList[index] = { ...todoList[index], ...body }
        return { code: 200, message: '更新成功' }
      }
      return { code: 500, message: '未找到任务' }
    }
  },
  {
    url: /^\/api\/todo\/delete\/\d+$/,
    method: 'delete',
    response: (config: any) => {
      const id = parseInt(config.url.split('/').pop())
      todoList = todoList.filter(t => t.id !== id)
      return { code: 200, message: '删除成功' }
    }
  }
] as MockMethod[]
