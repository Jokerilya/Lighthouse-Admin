import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

let notebookList = [
  {
    id: 1,
    title: '2024年第10周 个人周报',
    content: '## 🚀 上周工作记录\n- 完成项目初始化选型 (Vue3 + Vite + TS)\n- 搭建基础核心架构与 Axios 封装\n- 深度学习 Vue3 组合式 API 最佳实践',
    updateTime: '2024-03-09 18:00:00'
  },
  {
    id: 2,
    title: '2024年第11周 个人周报',
    content: '## 🚀 本周主要进展\n- 成功实现 Lighthouse Admin 权限闭环 (RBAC)\n- 引入 UnoCSS 极大提升了 UI 开发效率\n- 完成用户管理、菜单管理、角色管理核心 CRUD 模块',
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
          notebookList[index] = { ...notebookList[index], title, content, updateTime: Mock.Random.now('yyyy-MM-dd HH:mm:ss') }
          return { code: 200, message: '保存成功' }
        }
      }
      // 新增
      const newReport = {
        id: notebookList.length > 0 ? Math.max(...notebookList.map(n => n.id)) + 1 : 1,
        title,
        content,
        updateTime: Mock.Random.now('yyyy-MM-dd HH:mm:ss')
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
