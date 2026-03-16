import router from './index'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { getRouters } from '@/api/menu'
import { filterDynamicRoutes } from '@/utils/permission'

/**
 * 路由白名单
 */
const whiteList = ['/login']

/**
 * 全局路由导航守卫
 */
router.beforeEach(async (to, _from, next) => {
  nprogress.start()
  
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      nprogress.done()
    } else {
      // 检查是否已获取用户信息（以此判断是否已经加载过路由）
      if (userStore.roles.length === 0) {
        try {
          // 1. 获取用户信息
          await userStore.getInfo()
          
          // 2. 获取动态路由（原始菜单数据）
          const res: any = await getRouters()
          
          // 3. 将层级化的菜单数据保存到 permissionStore 供侧边栏循环渲染
          permissionStore.setMenuList(res)
          
          // 4. 转换菜单数据为 Vue-Router 格式
          // 在实际项目中，通常将所有后台菜单挂载到一个具名路由（如 'Layout'）的 children 下
          const dynamicRoutes = filterDynamicRoutes(res)
          
          // 5. 动态挂载路由
          // 注意：这里由于我们是在后台动态获取，为了让侧边栏组件能访问到，我们不仅要 addRoute
          // 还要确保 Sidebar 使用的是 permissionStore 里的数据
          dynamicRoutes.forEach(route => {
            // 将所有顶级菜单作为 Layout 的子路由添加，这样它们就能在 Layout 的内部展示
            router.addRoute('Layout', route)
          })

          // 6. 解决刷新页面时 404 的问题
          next({ ...to, replace: true })
        } catch (error) {
          console.error('路由跳转异常:', error)
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
          nprogress.done()
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      nprogress.done()
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})

