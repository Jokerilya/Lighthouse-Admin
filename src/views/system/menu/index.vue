<template>
  <div class="menu-container p-6 bg-[var(--el-bg-color)] rounded-xl shadow-sm min-h-full">
    <div class="flex-between mb-6">
      <el-form :inline="true" :model="queryParams">
        <el-form-item :label="$t('system.menu.name')">
          <el-input v-model="queryParams.menuName" :placeholder="$t('system.menu.name')" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="queryParams.status" :placeholder="$t('common.status')" clearable class="!w-32">
            <el-option :label="$t('common.normal')" :value="1" />
            <el-option :label="$t('common.disabled')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><i class="i-ep-search" /></template>
            {{ $t('common.search') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleAdd">
        <template #icon><i class="i-ep-plus" /></template>
        {{ $t('system.menu.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{ children: 'children' }"
      header-cell-class-name="!bg-[var(--el-fill-color-light)] !text-[var(--el-text-color-primary)] font-bold"
    >
      <el-table-column prop="menuName" :label="$t('system.menu.name')" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          {{ $t(row.menuName) }}
        </template>
      </el-table-column>
      <el-table-column prop="icon" :label="$t('system.menu.icon')" width="80" align="center">
        <template #default="{ row }">
          <div v-if="row.icon" :class="[row.icon, 'text-lg inline-block']" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="$t('system.menu.order')" width="100" align="center" />
      <el-table-column prop="menuType" :label="$t('system.menu.type')" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.menuType === 'M'" size="small">{{ $t('system.menu.dir') }}</el-tag>
          <el-tag v-else-if="row.menuType === 'C'" type="success" size="small">{{ $t('system.menu.menu') }}</el-tag>
          <el-tag v-else type="info" size="small">{{ $t('system.menu.button') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="perms" :label="$t('system.menu.perms')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="status" :label="$t('common.status')" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? $t('common.normal') : $t('common.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.action')" width="220" align="center" fixed="right">
        <template #default="{ row }">
          <div class="flex-center space-x-2">
            <el-button link type="primary" @click="handleEdit(row)">
              <template #icon><i class="i-ep-edit" /></template>
              {{ $t('common.edit') }}
            </el-button>
            <el-button link type="primary" @click="handleAdd(row)">
              <template #icon><i class="i-ep-plus" /></template>
              {{ $t('common.add') }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              <template #icon><i class="i-ep-delete" /></template>
              {{ $t('common.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMenuList } from '@/api/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const menuList = ref<any[]>([])
const queryParams = ref({
  menuName: '',
  status: undefined
})

const handleQuery = async () => {
  loading.value = true
  try {
    const res: any = await getMenuList()
    // 强制断开引用，防止响应式对象过深导致性能问题
    menuList.value = JSON.parse(JSON.stringify(res))
  } finally {
    loading.value = false
  }
}

const handleAdd = (_row?: any) => ElMessage.info(t('common.tip') + ': 新增功能正在开发中...')
const handleEdit = (_row: any) => ElMessage.info(t('common.tip') + ': 编辑功能正在开发中...')

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t('common.tip') + `: 确定要删除菜单 [${t(row.menuName)}] 吗?`,
    t('common.tip'),
    { type: 'warning' }
  ).then(() => {
    ElMessage.success(t('common.success'))
  })
}

onMounted(() => {
  handleQuery()
})
</script>

