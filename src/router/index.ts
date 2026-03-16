import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

/**
 * 基础路由表（白名单页面）
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'i-ep-monitor' }
      },
      {
        path: '/system/user',
        name: 'UserManagement',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'i-ep-user' }
      },
      {
        path: '/todo',
        name: 'TodoList',
        component: () => import('@/views/todo/index.vue'),
        meta: { title: '任务清单', icon: 'i-ep-list' }
      },
      {
        path: '/notebook',
        name: 'Notebook',
        component: () => import('@/views/notebook/index.vue'),
        meta: { title: '个人周报', icon: 'i-ep-notebook' }
      },
      {
        path: '/finance',
        name: 'Finance',
        component: () => import('@/views/finance/index.vue'),
        meta: { title: '理财看板', icon: 'i-ep-data-line' }
      }
    ]
  },
  // 404 路由兜底
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
