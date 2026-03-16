<template>
  <div class="notebook-container h-full flex space-x-4 bg-transparent overflow-hidden">
    <!-- 左侧列表栏 -->
    <div class="list-sidebar w-80 bg-white rounded-xl shadow-sm flex flex-col shrink-0 overflow-hidden">
      <div class="p-4 border-b flex-between bg-gray-50/50">
        <span class="font-bold text-gray-700">周报历史</span>
        <el-button type="primary" size="small" circle icon="i-ep-plus" @click="handleCreate" />
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-2">
        <div
          v-for="item in reports"
          :key="item.id"
          class="report-item p-3 rounded-lg border border-transparent cursor-pointer transition-all hover:bg-gray-50"
          :class="{ 'active-report !bg-blue-50 !border-blue-100': currentReport?.id === item.id }"
          @click="selectReport(item)"
        >
          <div class="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{{ item.title }}</div>
          <div class="text-[11px] text-gray-400 flex items-center justify-between">
            <span>{{ item.updateTime }}</span>
            <el-button 
              link 
              type="danger" 
              class="!p-0 opacity-0 group-hover:opacity-100" 
              @click.stop="handleDelete(item)"
            >
              <i class="i-ep-delete text-xs" />
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧编辑区域 -->
    <div v-if="currentReport" class="flex-1 flex flex-col space-y-4 overflow-hidden">
      <div class="bg-white p-4 rounded-xl shadow-sm flex-between">
        <div class="flex items-center space-x-4 flex-1">
          <el-input 
            v-model="currentReport.title" 
            placeholder="请输入标题..." 
            class="!text-lg font-bold flex-1"
          />
          <el-tag type="info" round size="small" class="shrink-0">
            上次保存: {{ saveStatus }}
          </el-tag>
        </div>
        <div class="ml-4 flex items-center space-x-2">
          <el-button type="primary" :loading="saving" @click="handleSave">
            <template #icon><i class="i-ep-check" /></template>
            保存周报
          </el-button>
        </div>
      </div>

      <div class="flex-1 bg-white rounded-xl shadow-sm overflow-hidden p-2">
        <MdEditor 
          v-model="currentReport.content" 
          :preview="true" 
          @onSave="handleSave"
          class="!h-full"
          language="zh-CN"
        />
      </div>
    </div>

    <div v-else class="flex-1 bg-white rounded-xl shadow-sm flex-center flex-col text-gray-300">
      <i class="i-ep-notebook text-8xl mb-4 opacity-10" />
      <p>选择或创建一个周报开始记录吧</p>
      <el-button type="primary" class="mt-4" @click="handleCreate">新建周报</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNotebookList, saveNotebook, deleteNotebook } from '@/api/notebook'

interface Report {
  id?: number
  title: string
  content: string
  updateTime?: string
}

const reports = ref<Report[]>([])
const currentReport = ref<Report | null>(null)
const saving = ref(false)
const saveStatus = ref('--:--')

/**
 * 加载列表
 */
const fetchList = async () => {
  const res: any = await getNotebookList()
  reports.value = res
  if (!currentReport.value && reports.value.length > 0) {
    currentReport.value = { ...reports.value[0] }
  }
}

/**
 * 选择周报
 */
const selectReport = (item: Report) => {
  currentReport.value = { ...item }
}

/**
 * 创建新周报
 */
const handleCreate = () => {
  currentReport.value = {
    title: `${new Date().getFullYear()}年第${getWeekNumber()}周 个人周报`,
    content: '## 🚀 本周主要进展\n\n## 📝 下周计划\n\n## 💡 心得/备注'
  }
}

/**
 * 保存
 */
const handleSave = async () => {
  if (!currentReport.value) return
  saving.value = true
  try {
    const res: any = await saveNotebook(currentReport.value)
    ElMessage.success('周报已保存至服务器')
    saveStatus.value = new Date().toLocaleTimeString()
    // 如果是新增，更新本地 ID 防止重复新增
    if (!currentReport.value.id && res.id) {
      currentReport.value.id = res.id
    }
    await fetchList()
  } finally {
    saving.value = false
  }
}

/**
 * 删除
 */
const handleDelete = (item: Report) => {
  ElMessageBox.confirm('确定要彻底删除这份周报吗?', '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteNotebook(item.id!)
    ElMessage.success('已从历史中移除')
    if (currentReport.value?.id === item.id) {
      currentReport.value = null
    }
    fetchList()
  })
}

/**
 * 获取当前周数
 */
function getWeekNumber() {
  const now = new Date()
  const onejan: any = new Date(now.getFullYear(), 0, 1)
  return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7)
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.report-item {
  position: relative;
  &:hover {
    .el-button {
      opacity: 1;
    }
  }
}

.active-report {
  .text-gray-800 {
    color: var(--el-color-primary);
  }
}

:deep(.md-editor) {
  border: none;
}
</style>
