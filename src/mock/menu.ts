import { MockMethod } from 'vite-plugin-mock'

// 模拟菜单数据 (使用 i18n 键名)
// 使用函数返回以确保每次请求获取的是全新对象，避免 UI 框架修改原始数据导致性能问题
const generateMenuList = () => [
  {
    id: 1,
    parentId: 0,
    menuName: 'menu.home',
    icon: 'i-ep-monitor',
    orderNum: 1,
    menuType: 'C',
    path: '/dashboard',
    component: 'dashboard/index',
    perms: '',
    status: 1,
    createTime: '2024-03-01 10:00:00'
  },
  {
    id: 2,
    parentId: 0,
    menuName: 'menu.system',
    icon: 'i-ep-setting',
    orderNum: 2,
    menuType: 'M',
    path: '/system',
    component: '',
    perms: '',
    status: 1,
    createTime: '2024-03-01 10:00:00',
    children: [
      {
        id: 100,
        parentId: 2,
        menuName: 'menu.user',
        icon: 'i-ep-user',
        orderNum: 1,
        menuType: 'C',
        path: 'user',
        component: 'system/user/index',
        perms: 'system:user:list',
        status: 1,
        createTime: '2024-03-01 10:00:00',
        children: [
          { id: 1000, parentId: 100, menuName: '用户查询', menuType: 'F', perms: 'system:user:query', status: 1 },
          { id: 1001, parentId: 100, menuName: '用户新增', menuType: 'F', perms: 'system:user:add', status: 1 },
          { id: 1002, parentId: 100, menuName: '用户修改', menuType: 'F', perms: 'system:user:edit', status: 1 },
          { id: 1003, parentId: 100, menuName: '用户删除', menuType: 'F', perms: 'system:user:remove', status: 1 }
        ]
      },
      {
        id: 101,
        parentId: 2,
        menuName: 'menu.role',
        icon: 'i-ep-avatar',
        orderNum: 2,
        menuType: 'C',
        path: 'role',
        component: 'system/role/index',
        perms: 'system:role:list',
        status: 1,
        createTime: '2024-03-01 10:00:00'
      },
      {
        id: 102,
        parentId: 2,
        menuName: 'menu.menu',
        icon: 'i-ep-menu',
        orderNum: 3,
        menuType: 'C',
        path: 'menu',
        component: 'system/menu/index',
        perms: 'system:menu:list',
        status: 1,
        createTime: '2024-03-01 10:00:00'
      },
      {
        id: 103,
        parentId: 2,
        menuName: 'menu.dept',
        icon: 'i-ep-office-building',
        orderNum: 4,
        menuType: 'C',
        path: 'dept',
        component: 'system/dept/index',
        perms: 'system:dept:list',
        status: 1,
        createTime: '2024-03-01 10:00:00'
      },
      {
        id: 104,
        parentId: 2,
        menuName: 'menu.dict',
        icon: 'i-ep-operation',
        orderNum: 5,
        menuType: 'C',
        path: 'dict',
        component: 'system/dict/index',
        perms: 'system:dict:list',
        status: 1,
        createTime: '2024-03-01 10:00:00'
      }
    ]
  },
  {
    id: 3,
    parentId: 0,
    menuName: 'menu.tool',
    icon: 'i-ep-opportunity',
    orderNum: 3,
    menuType: 'M',
    path: '/tool',
    component: '',
    perms: '',
    status: 1,
    createTime: '2024-03-01 10:00:00',
    children: [
      {
        id: 300,
        parentId: 3,
        menuName: 'menu.todo',
        icon: 'i-ep-list',
        orderNum: 1,
        menuType: 'C',
        path: '/todo',
        component: 'todo/index',
        perms: 'todo:list',
        status: 1,
        createTime: '2024-03-01 10:00:00'
      },
      {
        id: 301,
        parentId: 3,
        menuName: 'menu.notebook',
        icon: 'i-ep-notebook',
        orderNum: 2,
        menuType: 'C',
        path: '/notebook',
        component: 'notebook/index',
        perms: 'notebook:list',
        status: 1,
        createTime: '2024-03-01 10:00:00'
      }
    ]
  },
  {
    id: 4,
    parentId: 0,
    menuName: 'menu.assets',
    icon: 'i-ep-data-line',
    orderNum: 4,
    menuType: 'C',
    path: '/finance',
    component: 'finance/index',
    perms: 'finance:list',
    status: 1,
    createTime: '2024-03-01 10:00:00'
  }
]

export default [
  // 获取菜单列表
  {
    url: '/api/system/menu/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: generateMenuList()
      }
    }
  },
  // 获取路由菜单 (用于动态生成路由)
  {
    url: '/api/getRouters',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: generateMenuList()
      }
    }
  }
] as MockMethod[]

