<template>
  <div class="dept-container p-6 bg-[var(--el-bg-color)] rounded-xl shadow-sm min-h-full">
    <div class="flex-between mb-6">
      <el-form :inline="true" :model="queryParams">
        <el-form-item :label="$t('system.dept.name')">
          <el-input v-model="queryParams.deptName" :placeholder="$t('system.dept.name')" clearable @keyup.enter="handleQuery" />
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
          <el-button @click="resetQuery">
            <template #icon><i class="i-ep-refresh" /></template>
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleAdd">
        <template #icon><i class="i-ep-plus" /></template>
        {{ $t('system.dept.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
      header-cell-class-name="!bg-[var(--el-fill-color-light)] !text-[var(--el-text-color-primary)] font-bold"
    >
      <el-table-column prop="deptName" :label="$t('system.dept.name')" min-width="200" />
      <el-table-column prop="orderNum" :label="$t('system.menu.order')" width="100" align="center" />
      <el-table-column prop="status" :label="$t('common.status')" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? $t('common.normal') : $t('common.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('common.createTime')" width="200" align="center" />
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
            <el-button link type="danger" v-if="row.parentId !== 0" @click="handleDelete(row)">
              <template #icon><i class="i-ep-delete" /></template>
              {{ $t('common.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="上级部门" v-if="form.parentId !== 0">
          <el-tree-select
            v-model="form.parentId"
            :data="deptOptions"
            :props="{ label: 'deptName', value: 'id', children: 'children' }"
            value-key="id"
            placeholder="请选择上级部门"
            check-strictly
            class="w-full"
          />
        </el-form-item>
        <el-form-item :label="$t('system.dept.name')">
          <el-input v-model="form.deptName" :placeholder="$t('system.dept.name')" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.order')">
          <el-input-number v-model="form.orderNum" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('system.dept.leader')">
          <el-input v-model="form.leader" :placeholder="$t('system.dept.leader')" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t('common.normal') }}</el-radio>
            <el-radio :label="0">{{ $t('common.disabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDeptList, getDeptTree } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const deptList = ref<any[]>([])
const deptOptions = ref<any[]>([])
const queryParams = ref({
  deptName: '',
  status: undefined
})

const handleQuery = async () => {
  loading.value = true
  try {
    const res: any = await getDeptList(queryParams.value)
    deptList.value = res
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  queryParams.value = { deptName: '', status: undefined }
  handleQuery()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref<any>({})

const handleAdd = (row?: any) => {
  dialogTitle.value = t('system.dept.add')
  form.value = {
    parentId: row ? row.id : 0,
    deptName: '',
    orderNum: 0,
    status: 1
  }
  loadDeptOptions()
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = t('common.edit')
  form.value = { ...row }
  loadDeptOptions()
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t('common.tip') + `: 确定要删除部门 [${row.deptName}] 吗?`,
    t('common.tip'),
    { type: 'warning' }
  ).then(() => {
    ElMessage.success(t('common.success'))
  })
}

const loadDeptOptions = async () => {
  const res: any = await getDeptTree()
  deptOptions.value = res
}

onMounted(() => {
  handleQuery()
})
</script>
