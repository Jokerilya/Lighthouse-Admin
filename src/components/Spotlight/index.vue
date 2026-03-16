<template>
  <el-dialog
    v-model="visible"
    title="快速搜索"
    width="500px"
    :show-close="false"
    class="spotlight-dialog"
    destroy-on-close
  >
    <el-input
      v-model="query"
      placeholder="输入菜单名称搜索 (支持拼音/快捷键)"
      prefix-icon="i-ep-search"
      clearable
      ref="inputRef"
      @keyup.enter="handleEnter"
    />
    
    <div class="mt-4 max-h-[300px] overflow-y-auto">
      <div
        v-for="(item, index) in filteredMenus"
        :key="item.path"
        class="flex-between p-3 rounded-lg cursor-pointer transition-colors"
        :class="index === activeIndex ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="handleJump(item)"
        @mouseenter="activeIndex = index"
      >
        <div class="flex items-center">
          <i :class="item.icon" class="mr-3" />
          <span>{{ item.title }}</span>
        </div>
        <div class="text-xs opacity-60">{{ item.path }}</div>
      </div>
      
      <el-empty v-if="filteredMenus.length === 0" description="未找到匹配菜单" :image-size="60" />
    </div>
    
    <template #footer>
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex space-x-2">
          <span><el-tag size="small" effect="plain">↑↓</el-tag> 选择</span>
          <span><el-tag size="small" effect="plain">Enter</el-tag> 跳转</span>
        </div>
        <span><el-tag size="small" effect="plain">Ctrl+Shift+K</el-tag> 呼出</span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys } from '@vueuse/core'

const router = useRouter()
const visible = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref()

// 模拟菜单数据（实际应从 router 或 store 获取）
const menus = [
  { title: '仪表盘', path: '/dashboard', icon: 'i-ep-monitor' },
  { title: '任务清单', path: '/todo', icon: 'i-ep-list' },
  { title: '个人周报', path: '/notebook', icon: 'i-ep-notebook' },
  { title: '理财看板', path: '/finance', icon: 'i-ep-data-line' },
  { title: '用户管理', path: '/system/user', icon: 'i-ep-user' },
]

const { ctrl, shift, k, escape } = useMagicKeys()

// 暴露打开方法
const open = () => {
  visible.value = true
}

defineExpose({ open })

// 监听快捷键 Ctrl + Shift + K
watch([ctrl, shift, k], ([ctrlActive, shiftActive, kActive]) => {
  if (ctrlActive && shiftActive && kActive) {
    visible.value = !visible.value
  }
})

// 监听 Esc 关闭
watch(escape, (v) => {
  if (v) visible.value = false
})

watch(visible, (val) => {
  if (val) {
    query.value = ''
    activeIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

const filteredMenus = computed(() => {
  if (!query.value) return menus
  const q = query.value.toLowerCase()
  return menus.filter(m => 
    m.title.toLowerCase().includes(q) || 
    m.path.toLowerCase().includes(q)
  )
})

const handleJump = (item: any) => {
  router.push(item.path)
  visible.value = false
}

const handleEnter = () => {
  if (filteredMenus.value[activeIndex.value]) {
    handleJump(filteredMenus.value[activeIndex.value])
  }
}
</script>

<style lang="scss">
.spotlight-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding-top: 20px;
  }
  border-radius: 12px;
}
</style>
