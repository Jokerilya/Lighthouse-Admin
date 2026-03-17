import { createProdMockServer } from 'vite-plugin-mock/client'

// 导入所有的 mock 模块
import userMock from './mock/user'
import todoMock from './mock/todo'
import notebookMock from './mock/notebook'
import dictMock from './mock/dict'
import deptMock from './mock/dept'
import menuMock from './mock/menu'
import roleMock from './mock/role'
import loginMock from './mock/login'

/**
 * 手动创建生产环境的 Mock 服务
 * 这样打包后，Mock 数据会被打包进 JS 文件中，在浏览器端拦截 Ajax 请求
 */
export function setupProdMockServer() {
  createProdMockServer([
    ...userMock,
    ...todoMock,
    ...notebookMock,
    ...dictMock,
    ...deptMock,
    ...menuMock,
    ...roleMock,
    ...loginMock
  ])
}
