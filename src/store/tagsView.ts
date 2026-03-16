import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'

interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
}

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [] as TagView[],
    cachedViews: [] as string[]
  }),
  actions: {
    addView(view: RouteLocationNormalized) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    addVisitedView(view: RouteLocationNormalized) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      const title = (view.meta?.title as string) || 'no-name'
      this.visitedViews.push({
        ...view,
        title
      })
    },
    addCachedView(view: RouteLocationNormalized) {
      const name = view.name as string
      if (this.cachedViews.includes(name)) return
      if (!view.meta.noCache) {
        this.cachedViews.push(name)
      }
    },
    delView(view: TagView) {
      return new Promise(resolve => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    delVisitedView(view: TagView) {
      const index = this.visitedViews.findIndex(v => v.path === view.path)
      if (index > -1) {
        this.visitedViews.splice(index, 1)
      }
    },
    delCachedView(view: TagView) {
      const name = view.name as string
      const index = this.cachedViews.indexOf(name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
    },
    delOthersViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter(v => {
        return v.meta?.affix || v.path === view.path
      })
      this.cachedViews = this.cachedViews.filter(name => name === view.name)
    },
    delAllViews() {
      this.visitedViews = this.visitedViews.filter(tag => tag.meta?.affix)
      this.cachedViews = []
    }
  }
})
