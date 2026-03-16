<template>
  <div class="dict-container p-6 bg-[var(--el-bg-color)] rounded-xl shadow-sm min-h-full">
    <div class="flex-between mb-6">
      <el-form :inline="true" :model="queryParams">
        <el-form-item :label="$t('system.dict.name')">
          <el-input v-model="queryParams.name" :placeholder="$t('system.dict.name')" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item :label="$t('system.dict.type')">
          <el-input v-model="queryParams.type" :placeholder="$t('system.dict.type')" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><i class="i-ep-search" /></template>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="resetQuery">
            <template #icon><i class="i-ep-refresh" /></template>
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleAdd">
        <template #icon><i class="i-ep-plus" /></template>
        {{ $t('system.dict.add') }}
      </el-button>
    </div>

    <el-table 
      v-loading="loading" 
      :data="typeList"
      header-cell-class-name="!bg-[var(--el-fill-color-light)] !text-[var(--el-text-color-primary)] font-bold"
    >
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column :label="$t('system.dict.name')" prop="name" min-width="120" />
      <el-table-column :label="$t('system.dict.type')" prop="type" min-width="150" />
      <el-table-column :label="$t('common.status')" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? $t('common.normal') : $t('common.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.dict.remark')" prop="remark" show-overflow-tooltip />
      <el-table-column :label="$t('common.createTime')" prop="createTime" width="180" align="center" />
      <el-table-column :label="$t('common.action')" width="260" align="center" fixed="right">
        <template #default="{ row }">
          <div class="flex-center space-x-2">
            <el-button link type="primary" @click="handleViewData(row)">
              <template #icon><i class="i-ep-view" /></template>
              {{ $t('system.dict.data') }}
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)">
              <template #icon><i class="i-ep-edit" /></template>
              {{ $t('common.edit') }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              <template #icon><i class="i-ep-delete" /></template>
              {{ $t('common.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 字典数据对话框 -->
    <el-dialog v-model="dataVisible" :title="`${$t('system.dict.data')} - ${currentType?.name}`" width="700px">
      <el-table :data="currentData">
        <el-table-column label="标签" prop="label" />
        <el-table-column label="值" prop="value" />
        <el-table-column label="样式" prop="listClass">
          <template #default="{ row }">
            <el-tag :type="row.listClass">{{ row.listClass }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="100" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditData(row)">{{ $t('common.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDictTypeList, deleteDictType } from '@/api/dict'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const typeList = ref<any[]>([])
const queryParams = ref({
  name: '',
  type: '',
  page: 1,
  pageSize: 10
})

const handleQuery = async () => {
  loading.value = true
  try {
    const res: any = await getDictTypeList(queryParams.value)
    typeList.value = res.list
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  queryParams.value = { name: '', type: '', page: 1, pageSize: 10 }
  handleQuery()
}

const handleAdd = () => ElMessage.info(t('common.tip') + ': 新增功能正在开发中...')
const handleEdit = (_row: any) => ElMessage.info(t('common.tip') + ': 编辑功能正在开发中...')
const handleEditData = (_row: any) => ElMessage.info(t('common.tip') + ': 数据编辑功能正在开发中...')

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t('common.tip') + `: 确定要删除字典类型 "${row.name}" 吗?`,
    t('common.tip')
  ).then(async () => {
    await deleteDictType(row.id)
    ElMessage.success(t('common.success'))
    handleQuery()
  })
}

// 数据预览逻辑
const dataVisible = ref(false)
const currentType = ref<any>(null)
const currentData = ref<any[]>([])

const handleViewData = (row: any) => {
  currentType.value = row
  currentData.value = row.data || []
  dataVisible.value = true
}

onMounted(() => {
  handleQuery()
})
</script>
