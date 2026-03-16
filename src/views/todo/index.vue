<template>
  <div class="todo-container p-4 max-w-4xl mx-auto">
    <!-- 头部输入框 -->
    <div class="header-input bg-[var(--el-bg-color)] p-4 sm:p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
      <el-input
        v-model="newTask.content"
        :placeholder="$t('todo.placeholder')"
        clearable
        @keyup.enter="handleAdd"
        class="!rounded-xl flex-1"
      >
        <template #prefix>
          <i class="i-ep-edit text-gray-400" />
        </template>
      </el-input>
      <el-select v-model="newTask.priority" class="!w-32">
        <el-option :label="$t('todo.priority.high')" value="high">
          <template #default>
            <span class="flex items-center text-red-500 font-bold">
              <i class="i-ep-warning mr-1" /> {{ $t('todo.priority.high') }}
            </span>
          </template>
        </el-option>
        <el-option :label="$t('todo.priority.medium')" value="medium">
          <template #default>
            <span class="flex items-center text-orange-500 font-bold">
              <i class="i-ep-warning mr-1" /> {{ $t('todo.priority.medium') }}
            </span>
          </template>
        </el-option>
        <el-option :label="$t('todo.priority.low')" value="low">
          <template #default>
            <span class="flex items-center text-green-500 font-bold">
              <i class="i-ep-warning mr-1" /> {{ $t('todo.priority.low') }}
            </span>
          </template>
        </el-option>
      </el-select>
      <el-button type="primary" class="!rounded-xl px-8" @click="handleAdd">{{ $t('todo.add') }}</el-button>
    </div>

    <!-- 任务统计 -->
    <div class="flex items-center justify-between mb-4 px-2">
      <div class="flex space-x-4 text-sm text-gray-500 font-medium">
        <span>{{ $t('todo.all') }}: {{ list.length }}</span>
        <span class="text-blue-500">{{ $t('todo.ongoing') }}: {{ activeCount }}</span>
        <span class="text-green-500">{{ $t('todo.completed') }}: {{ completedCount }}</span>
      </div>
      <el-button link type="primary" size="small" @click="fetchList">{{ $t('todo.refresh') }}</el-button>
    </div>

    <el-skeleton :loading="loading" animated :count="3">
      <template #template>
        <div class="h-20 bg-gray-100 rounded-xl mb-3 dark:bg-gray-800" />
      </template>
      <template #default>
        <!-- 可拖拽列表 -->
        <VueDraggable
          v-model="list"
          class="todo-list space-y-3"
          :animation="150"
          ghost-class="ghost"
          handle=".drag-handle"
          @end="handleSortEnd"
        >
          <div
            v-for="item in list"
            :key="item.id"
            class="todo-item bg-[var(--el-bg-color)] p-4 rounded-xl shadow-sm border-l-4 flex items-center group transition-all"
            :class="[
              item.status === 1 ? 'opacity-60 grayscale border-gray-300' : 'border-primary',
              getPriorityBorder(item.priority)
            ]"
          >
            <!-- 拖拽手柄 -->
            <div class="drag-handle i-ep-rank text-gray-300 cursor-move mr-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <!-- 复选框 -->
            <el-checkbox
              :model-value="item.status"
              :true-label="1"
              :false-label="0"
              size="large"
              @change="(val: any) => { item.status = val; handleStatusChange(item); }"
            />
    
            <!-- 任务内容 -->
            <div class="flex-1 ml-4 overflow-hidden">
              <p 
                class="text-[var(--el-text-color-primary)] transition-all truncate"
                :class="{ 'line-through text-gray-400': item.status === 1 }"
              >
                {{ item.content }}
              </p>
              <div class="flex items-center mt-1 space-x-4 text-[10px] text-gray-400">
                <span class="flex items-center uppercase font-bold" :class="getPriorityColor(item.priority)">
                  {{ $t(`todo.priority.${item.priority}`) }}
                </span>
                <span>Created at {{ item.createTime }}</span>
              </div>
            </div>
    
            <!-- 操作按钮 -->
            <div class="flex items-center space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <el-button link type="danger" @click="handleDelete(item)">
                <template #icon><i class="i-ep-delete" /></template>
              </el-button>
            </div>
          </div>
        </VueDraggable>
      </template>
    </el-skeleton>

    <!-- 空状态 -->
    <div v-if="list.length === 0 && !loading" class="flex-center py-20 flex-col text-gray-300">
      <div class="i-ep-sunny text-6xl mb-4 opacity-20" />
      <p>{{ $t('todo.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTodoList, addTodo, updateTodo, deleteTodo } from '@/api/todo'

interface TodoItem {
  id: number
  content: string
  status: number
  priority: 'high' | 'medium' | 'low'
  createTime: string
}

const loading = ref(false)
const list = ref<TodoItem[]>([])

const newTask = reactive({
  content: '',
  priority: 'low'
})

const activeCount = computed(() => list.value.filter(item => item.status === 0).length)
const completedCount = computed(() => list.value.filter(item => item.status === 1).length)

/**
 * 获取任务列表
 */
const fetchList = async () => {
  loading.value = true
  try {
    const res: any = await getTodoList()
    list.value = res
  } finally {
    loading.value = false
  }
}

/**
 * 添加任务
 */
const handleAdd = async () => {
  if (!newTask.content.trim()) {
    ElMessage.warning('请输入任务内容')
    return
  }
  await addTodo({ ...newTask })
  newTask.content = ''
  newTask.priority = 'low'
  ElMessage.success('添加成功')
  fetchList()
}

/**
 * 状态切换
 */
const handleStatusChange = async (item: any) => {
  await updateTodo(item)
  ElMessage.success(item.status === 1 ? '任务已完成' : '任务已重开')
}

/**
 * 排序结束
 */
const handleSortEnd = async () => {
  // 拖拽结束后，全量同步列表顺序
  await updateTodo(list.value)
  ElMessage.success('排序已保存')
}

/**
 * 删除任务
 */
const handleDelete = (item: any) => {
  ElMessageBox.confirm('确定要删除该任务吗?', '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteTodo(item.id)
    ElMessage.success('删除成功')
    fetchList()
  })
}

// 样式辅助函数
const getPriorityBorder = (p: string) => {
  if (p === 'high') return '!border-red-400'
  if (p === 'medium') return '!border-orange-400'
  return '!border-green-400'
}

const getPriorityColor = (p: string) => {
  if (p === 'high') return 'text-red-500'
  if (p === 'medium') return 'text-orange-500'
  return 'text-green-500'
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.ghost {
  opacity: 0.5;
  background: #ecf5ff;
}

.todo-item {
  &:hover {
    background-color: #fcfdfe;
    transform: translateX(4px);
  }
}

:deep(.el-checkbox.is-checked + .el-checkbox__label) {
  color: #909399;
}
</style>
