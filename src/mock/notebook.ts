import { MockMethod } from 'vite-plugin-mock'

let notebookList = [
  {
    id: 1,
    title: '2024年第10周 个人周报',
    content: '## 🚀 上周工作记录\n- 完成项目选型\n- 学习 Vue3 组合式 API',
    updateTime: '2024-03-09 18:00:00'
  },
  {
    id: 2,
    title: '2024年第11周 个人周报',
    content: '## 🚀 本周主要进展\n- 完成 Lighthouse Admin 核心架构\n- 用户管理与 Todo 模块完成',
    updateTime: '2024-03-16 10:00:00'
  }
]

export default [
  // 获取列表
  {
    url: '/api/notebook/list',
    method: 'get',
    response: () => {
      return { code: 200, data: notebookList, message: '获取成功' }
    }
  },
  // 保存/更新
  {
    url: '/api/notebook/save',
    method: 'post',
    response: ({ body }: any) => {
      const { id, title, content } = body
      if (id) {
        const index = notebookList.findIndex(n => n.id === id)
        if (index !== -1) {
          notebookList[index] = { ...notebookList[index], title, content, updateTime: new Date().toLocaleString() }
          return { code: 200, message: '保存成功' }
        }
      }
      // 新增
      const newReport = {
        id: notebookList.length > 0 ? Math.max(...notebookList.map(n => n.id)) + 1 : 1,
        title,
        content,
        updateTime: new Date().toLocaleString()
      }
      notebookList.unshift(newReport)
      return { code: 200, data: newReport, message: '添加成功' }
    }
  },
  // 删除
  {
    url: /^\/api\/notebook\/delete\/\d+$/,
    method: 'delete',
    response: (config: any) => {
      const id = parseInt(config.url.split('/').pop())
      notebookList = notebookList.filter(n => n.id !== id)
      return { code: 200, message: '删除成功' }
    }
  }
] as MockMethod[]
