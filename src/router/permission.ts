import router from './index'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'

/**
 * 路由白名单
 */
const whiteList = ['/login']

/**
 * 全局路由导航守卫
 */
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录则重定向到首页
      next({ path: '/' })
      nprogress.done()
    } else {
      // 模拟逻辑：如果以后有动态路由，这里需要处理角色权限
      next()
    }
  } else {
    // 未登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单中，直接进入
      next()
    } else {
      // 不在白名单中，重定向到登录页
      next(`/login?redirect=${to.path}`)
      nprogress.done()
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})
