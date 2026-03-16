import { defineStore } from 'pinia'

interface AppState {
  sidebar: {
    opened: boolean
  }
}

/**
 * 应用配置状态存储
 * 控制侧边栏展开折叠等全局 UI 状态
 */
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: true
    }
  }),
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
    }
  }
})
