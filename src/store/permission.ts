import { defineStore } from 'pinia'

interface PermissionState {
  menuList: any[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    menuList: []
  }),
  actions: {
    setMenuList(menus: any[]) {
      this.menuList = menus
    }
  }
})
