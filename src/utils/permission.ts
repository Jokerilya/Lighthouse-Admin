import { RouteRecordRaw } from 'vue-router'

// 匹配 src/views 下所有的 .vue 文件
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 将菜单列表转换为路由记录
 */
export function filterDynamicRoutes(menus: any[]): RouteRecordRaw[] {
  const dynamicRoutes: RouteRecordRaw[] = []

  menus.forEach(menu => {
    // 仅处理目录 (M) 和 菜单 (C)
    if (menu.menuType === 'M' || menu.menuType === 'C') {
      const route: any = {
        path: menu.path,
        name: menu.perms || menu.path + menu.id,
        meta: {
          title: menu.menuName,
          icon: menu.icon,
          noCache: false
        }
      }

      // 如果有组件路径，则进行动态加载
      if (menu.component) {
        // 格式化路径，确保以 ../views/ 开头并以 .vue 结尾
        const componentPath = menu.component.startsWith('/') 
          ? `../views${menu.component}.vue` 
          : `../views/${menu.component}.vue`
        
        // 从 glob 匹配到的模块中提取
        if (modules[componentPath]) {
          route.component = modules[componentPath]
        } else {
          console.error(`未找到组件模块: ${componentPath}`)
          // 回退到 404 或显示错误提示组件
          route.component = () => import('../views/error/404.vue')
        }
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        route.children = filterDynamicRoutes(menu.children)
      }

      dynamicRoutes.push(route)
    }
  })

  return dynamicRoutes
}
