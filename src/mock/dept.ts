import { MockMethod } from 'vite-plugin-mock'

// 模拟部门数据
const deptList = [
  {
    id: 100,
    parentId: 0,
    deptName: 'Lighthouse Group',
    orderNum: 1,
    leader: 'Joker Huang',
    phone: '13888888888',
    email: 'ceo@lighthouse.com',
    status: 1,
    createTime: '2024-01-01 10:00:00',
    children: [
      {
        id: 101,
        parentId: 100,
        deptName: '技术研发中心',
        orderNum: 1,
        leader: '阿强',
        phone: '13000000001',
        email: 'cto@lighthouse.com',
        status: 1,
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: 103,
            parentId: 101,
            deptName: '前端开发部',
            orderNum: 1,
            leader: '小明',
            phone: '13000000002',
            email: 'fe@lighthouse.com',
            status: 1,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 104,
            parentId: 101,
            deptName: '后端开发部',
            orderNum: 2,
            leader: '大飞',
            phone: '13000000003',
            email: 'be@lighthouse.com',
            status: 1,
            createTime: '2024-01-01 10:00:00'
          }
        ]
      },
      {
        id: 102,
        parentId: 100,
        deptName: '产品设计中心',
        orderNum: 2,
        leader: '丽丽',
        phone: '13000000004',
        email: 'product@lighthouse.com',
        status: 1,
        createTime: '2024-01-01 10:00:00'
      }
    ]
  }
]

export default [
  // 获取部门列表
  {
    url: '/api/system/dept/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: deptList
      }
    }
  },
  // 获取部门树
  {
    url: '/api/system/dept/tree',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: deptList
      }
    }
  }
] as MockMethod[]
