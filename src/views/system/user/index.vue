<template>
  <div class="user-container bg-[var(--el-bg-color)] p-6 rounded-xl shadow-sm min-h-full flex flex-col">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryParams" ref="queryFormRef" class="mb-6">
      <el-form-item :label="$t('user.name')" prop="username">
        <el-input
          v-model="queryParams.username"
          :placeholder="$t('user.name')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-60"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <template #icon><i class="i-ep-search" /></template>
          {{ $t('user.search') }}
        </el-button>
        <el-button @click="handleReset(queryFormRef)">
          <template #icon><i class="i-ep-refresh" /></template>
          {{ $t('user.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区 -->
    <div class="mb-4">
      <el-button v-hasPerm="['system:user:add']" type="primary" @click="handleAdd">
        <template #icon><i class="i-ep-plus" /></template>
        {{ $t('user.add') }}
      </el-button>
      <el-button v-hasPerm="['system:user:remove']" type="danger" plain @click="handleBatchDelete">
        <template #icon><i class="i-ep-delete" /></template>
        {{ $t('user.batchDelete') }}
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table 
      v-loading="loading" 
      :data="tableData" 
      class="flex-1"
      header-cell-class-name="!bg-[var(--el-fill-color-light)] !text-[var(--el-text-color-primary)] font-bold"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="username" :label="$t('user.name')" min-width="120" />
      <el-table-column prop="nickname" :label="$t('user.nickname')" min-width="120" />
      <el-table-column prop="role" :label="$t('user.role')" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.role === 'admin'" type="danger">超级管理员</el-tag>
          <el-tag v-else-if="row.role === 'common'" type="warning">普通员工</el-tag>
          <el-tag v-else type="info">访客</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" :label="$t('user.email')" min-width="180" />
      <el-table-column prop="status" :label="$t('user.status')" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('user.createTime')" width="180" align="center" />
      <el-table-column :label="$t('user.action')" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <el-button v-hasPerm="['system:user:edit']" link type="primary" @click="handleEdit(row)">
            <template #icon><i class="i-ep-edit" /></template>
            {{ $t('user.edit') }}
          </el-button>
          <el-button v-hasPerm="['system:user:remove']" link type="danger" @click="handleDelete(row)">
            <template #icon><i class="i-ep-delete" /></template>
            {{ $t('user.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="mt-6 flex justify-end">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 (演示用途，逻辑简略) -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      append-to-body
    >
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="请选择角色" class="w-full">
            <el-option label="超级管理员" value="admin" />
            <el-option label="普通员工" value="common" />
            <el-option label="访客" value="guest" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getUserList, addUser, updateUser, deleteUser, batchDeleteUser } from '@/api/user'
import { useTable } from '@/hooks/useTable'

const queryFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 使用通用的 useTable hook
const {
  tableData,
  loading,
  total,
  pagination,
  queryParams,
  getList,
  handleQuery,
  handleReset,
  handleSizeChange,
  handleCurrentChange
} = useTable(getUserList, { username: '' })

const submitLoading = ref(false)
const selectedIds = ref<number[]>([])

// 表单数据
const userForm = reactive({
  id: undefined,
  username: '',
  nickname: '',
  role: 'visitor'
})

/**
 * 新增用户
 */
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  Object.assign(userForm, { id: undefined, username: '', nickname: '', role: 'visitor' })
  dialogVisible.value = true
}

/**
 * 编辑用户
 */
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑用户'
  Object.assign(userForm, row)
  dialogVisible.value = true
}

/**
 * 表单提交
 */
const handleSubmit = async () => {
  submitLoading.value = true
  try {
    if (userForm.id) {
      await updateUser(userForm)
      ElMessage.success('修改成功')
    } else {
      await addUser(userForm)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList() // 重新加载列表数据
  } finally {
    submitLoading.value = false
  }
}

/**
 * 删除用户
 */
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除用户 [${row.nickname}] 吗?`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    getList() // 重新加载列表
  })
}

/**
 * 选择项改变
 */
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

/**
 * 批量删除
 */
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先勾选要删除的用户')
    return
  }
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗?`, '提示', {
    type: 'warning'
  }).then(async () => {
    await batchDeleteUser(selectedIds.value)
    ElMessage.success('批量删除成功')
    getList()
  })
}

/**
 * 状态切换
 */
const handleStatusChange = (row: any) => {
  const statusName = row.status === 1 ? '激活' : '禁用'
  ElMessage.success(`用户 [${row.nickname}] 已${statusName}`)
}
</script>

