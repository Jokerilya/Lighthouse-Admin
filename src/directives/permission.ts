import { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/user'

/**
 * 按钮权限指令
 * 格式：v-hasPerm="['system:user:add']"
 */
export default (app: App) => {
  app.directive('hasPerm', {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const { value } = binding
      const userStore = useUserStore()
      const permissions = userStore.permissions || []

      if (value && value instanceof Array && value.length > 0) {
        const hasPermission = permissions.some(perm => {
          return permissions.includes('*') || value.includes(perm)
        })

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`请使用 v-hasPerm="['system:user:add']" 格式分配权限`)
      }
    }
  })
}

