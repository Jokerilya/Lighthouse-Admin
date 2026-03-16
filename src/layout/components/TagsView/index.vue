<template>
  <div class="tags-view-container h-9 w-full bg-[var(--el-bg-color)] border-b border-[var(--el-border-color-lighter)] flex items-center px-4 overflow-hidden relative">
    <div class="flex-1 flex overflow-x-auto no-scrollbar items-center space-x-1 h-full">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        class="tag-item px-3 h-7 flex items-center rounded-md text-xs cursor-pointer transition-all border border-transparent whitespace-nowrap group select-none"
        :class="isActive(tag) ? 'bg-primary/10 text-primary border-primary/20 !font-bold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        <span class="mr-1">{{ tag.title }}</span>
        <i 
          v-if="!tag.meta?.affix"
          class="i-ep-close text-[10px] hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)

const isActive = (tag: any) => {
  return tag.path === route.path
}

const addTags = () => {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route)
  }
}

const closeSelectedTag = (view: any) => {
  tagsViewStore.delView(view).then((res: any) => {
    if (isActive(view)) {
      toLastView(res.visitedViews)
    }
  })
}

const toLastView = (visitedViews: any[]) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

watch(route, () => {
  addTags()
})

onMounted(() => {
  addTags()
})
</script>

<style scoped lang="scss">
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.tag-item {
  &.active {
    &::before {
      content: '';
      background: #fff;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: relative;
      margin-right: 2px;
    }
  }
}
</style>
