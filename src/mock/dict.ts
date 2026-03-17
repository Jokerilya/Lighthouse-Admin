import { MockMethod } from 'vite-plugin-mock'

// 模拟字典数据
let dictList = [
  {
    id: 1,
    name: '用户性别',
    type: 'sys_user_sex',
    status: 1,
    remark: '用户性别列表',
    createTime: '2024-03-10 12:00:00',
    data: [
      { label: '男', value: '0', listClass: 'primary' },
      { label: '女', value: '1', listClass: 'danger' },
      { label: '未知', value: '2', listClass: 'info' }
    ]
  },
  {
    id: 2,
    name: '任务状态',
    type: 'sys_todo_status',
    status: 1,
    remark: '代办任务状态',
    createTime: '2024-03-10 12:00:00',
    data: [
      { label: '进行中', value: '0', listClass: 'primary' },
      { label: '已完成', value: '1', listClass: 'success' },
      { label: '已延期', value: '2', listClass: 'warning' }
    ]
  },
  {
    id: 3,
    name: '资产类型',
    type: 'sys_finance_type',
    status: 1,
    remark: '理财资产类型',
    createTime: '2024-03-12 12:00:00',
    data: [
      { label: '股票', value: 'stock', listClass: 'primary' },
      { label: '基金', value: 'fund', listClass: 'success' },
      { label: '现金', value: 'cash', listClass: 'warning' },
      { label: '债券', value: 'bond', listClass: 'danger' },
      { label: '黄金', value: 'gold', listClass: 'warning' },
      { label: '其他', value: 'other', listClass: 'info' }
    ]
  },
  {
    id: 4,
    name: '菜单类型',
    type: 'sys_menu_type',
    status: 1,
    remark: '系统菜单类型',
    createTime: '2024-03-15 12:00:00',
    data: [
      { label: '目录', value: 'M', listClass: 'primary' },
      { label: '菜单', value: 'C', listClass: 'success' },
      { label: '按钮', value: 'F', listClass: 'info' }
    ]
  }
]

export default [
  // 获取字典列表
  {
    url: '/api/dict/type/list',
    method: 'get',
    response: (config: any) => {
      const { name, type, page = 1, pageSize = 10 } = config.query
      const filtered = dictList.filter(item => 
        (!name || item.name.includes(name)) && 
        (!type || item.type.includes(type))
      )
      return {
        code: 200,
        data: {
          total: filtered.length,
          list: filtered.slice((page - 1) * pageSize, page * pageSize)
        }
      }
    }
  },
  // 根据类型获取字典数据
  {
    url: '/api/dict/data/type',
    method: 'get',
    response: (config: any) => {
      const { type } = config.query
      const dict = dictList.find(item => item.type === type)
      return {
        code: 200,
        data: dict ? dict.data : []
      }
    }
  },
  // 删除字典类型
  {
    url: /^\/api\/dict\/type\/delete\/\d+$/,
    method: 'delete',
    response: (config: any) => {
      const id = parseInt(config.url.split('/').pop())
      dictList = dictList.filter(item => item.id !== id)
      return { code: 200, message: '删除成功' }
    }
  }
] as MockMethod[]
