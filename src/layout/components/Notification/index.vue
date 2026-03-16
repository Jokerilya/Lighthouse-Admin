<template>
  <el-dropdown trigger="click">
    <div class="relative cursor-pointer hover:text-primary transition-colors">
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="flex-center">
        <div class="i-ep-bell text-xl" />
      </el-badge>
    </div>
    <template #dropdown>
      <div class="w-80 overflow-hidden rounded-lg">
        <div class="px-4 py-3 border-b flex-between bg-gray-50/50">
          <span class="font-bold text-sm">系统通知</span>
          <el-button v-if="unreadCount > 0" link type="primary" size="small" @click="markAllAsRead">全部已读</el-button>
        </div>
        
        <div class="max-h-96 overflow-y-auto">
          <div v-if="messages.length === 0" class="py-10 flex-center flex-col text-gray-300">
            <div class="i-ep-message text-4xl mb-2 opacity-20" />
            <p class="text-xs">暂无新通知</p>
          </div>
          
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors group"
            @click="markAsRead(msg)"
          >
            <div class="flex items-start">
              <div :class="[getTypeIcon(msg.type), getTypeColor(msg.type), 'text-lg mt-0.5 mr-3 shrink-0']" />
              <div class="flex-1 min-w-0">
                <div class="flex-between mb-1">
                  <span class="text-sm font-medium truncate" :class="{ 'text-gray-400': msg.read }">{{ msg.title }}</span>
                  <span class="text-[10px] text-gray-400 shrink-0">{{ msg.time }}</span>
                </div>
                <p class="text-xs text-gray-500 line-clamp-2" :class="{ 'opacity-60': msg.read }">{{ msg.content }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="py-3 text-center border-t bg-gray-50/30">
          <el-button link size="small" class="!text-gray-400">查看历史通知</el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface Message {
  id: number
  title: string
  content: string
  time: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
}

const messages = ref<Message[]>([
  {
    id: 1,
    title: '系统更新成功',
    content: 'Lighthouse Admin 已更新至 v2.0.0 版本，新增了多页签和国际化功能。',
    time: '10分钟前',
    type: 'success',
    read: false
  },
  {
    id: 2,
    title: '资产波动提醒',
    content: '您的理财资产「腾讯控股」今日波动超过 5%，请注意查看。',
    time: '1小时前',
    type: 'warning',
    read: false
  },
  {
    id: 3,
    title: '新功能上线计划',
    content: '下周将上线可视化数据导出功能，支持多种格式导出报表。',
    time: '昨日',
    type: 'info',
    read: true
  }
])

const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success': return 'i-ep-circle-check-filled'
    case 'warning': return 'i-ep-warning-filled'
    case 'error': return 'i-ep-circle-close-filled'
    default: return 'i-ep-info-filled'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-green-500'
    case 'warning': return 'text-orange-500'
    case 'error': return 'text-red-500'
    default: return 'text-primary'
  }
}

const markAsRead = (msg: Message) => {
  if (!msg.read) {
    msg.read = true
  }
}

const markAllAsRead = () => {
  messages.value.forEach(m => m.read = true)
  ElMessage.success('已全部标为已读')
}
</script>
