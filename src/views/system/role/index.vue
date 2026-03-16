<template>
  <div class="role-container p-6 bg-[var(--el-bg-color)] rounded-xl shadow-sm min-h-full">
    <div class="flex-between mb-6">
      <el-form :inline="true" :model="queryParams">
        <el-form-item :label="$t('system.role.name')">
          <el-input v-model="queryParams.roleName" :placeholder="$t('system.role.name')" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item :label="$t('system.role.key')">
          <el-input v-model="queryParams.roleKey" :placeholder="$t('system.role.key')" clearable @keyup.enter="handleQuery" />
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
        {{ $t('system.role.add') }}
      </el-button>
    </div>

    <el-table 
      v-loading="loading" 
      :data="roleList"
      header-cell-class-name="!bg-[var(--el-fill-color-light)] !text-[var(--el-text-color-primary)] font-bold"
    >
      <el-table-column label="ID" prop="id" width="80" align="center" />
      <el-table-column :label="$t('system.role.name')" prop="roleName" min-width="120" />
      <el-table-column :label="$t('system.role.key')" prop="roleKey" min-width="120" />
      <el-table-column :label="$t('system.role.sort')" prop="roleSort" width="80" align="center" />
      <el-table-column :label="$t('common.status')" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" prop="createTime" width="180" align="center" />
      <el-table-column :label="$t('common.action')" width="260" align="center" fixed="right">
        <template #default="{ row }">
          <div class="flex-center space-x-2">
            <el-button link type="primary" @click="handleEdit(row)">
              <template #icon><i class="i-ep-edit" /></template>
              {{ $t('common.edit') }}
            </el-button>
            <el-button link type="primary" @click="handlePermission(row)">
              <template #icon><i class="i-ep-setting" /></template>
              {{ $t('system.role.assign') }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              <template #icon><i class="i-ep-delete" /></template>
              {{ $t('common.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" ref="roleFormRef" label-width="100px" :rules="rules">
        <el-form-item :label="$t('system.role.name')" prop="roleName">
          <el-input v-model="form.roleName" :placeholder="$t('system.role.name')" />
        </el-form-item>
        <el-form-item :label="$t('system.role.key')" prop="roleKey">
          <el-input v-model="form.roleKey" :placeholder="$t('system.role.key')" />
        </el-form-item>
        <el-form-item :label="$t('system.role.sort')" prop="roleSort">
          <el-input-number v-model="form.roleSort" :min="0" class="!w-full" />
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">{{ $t('common.normal') }}</el-radio>
            <el-radio :label="0">{{ $t('common.disabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog v-model="permVisible" :title="$t('system.role.assign')" width="500px">
      <div class="mb-4 text-sm text-gray-500">
        {{ $t('system.role.assign') }} - <span class="text-primary font-bold">{{ currentRole?.roleName }}</span>
      </div>
      <el-tree
        ref="menuTreeRef"
        :data="menuOptions"
        show-checkbox
        node-key="id"
        :props="{ label: 'menuName', children: 'children' }"
        style="height: 300px; overflow-y: auto;"
      >
        <template #default="{ data }">
          <span>{{ $t(data.menuName) }}</span>
        </template>
      </el-tree>
      <template #footer>
        <el-button @click="permVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitPermission">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { getRoleList, getRoleMenuIds, changeRoleStatus, addRole, updateRole, deleteRole } from '@/api/role'
import { getMenuList } from '@/api/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const roleList = ref<any[]>([])
const queryParams = reactive({
  roleName: '',
  roleKey: '',
  page: 1,
  pageSize: 10
})

const handleQuery = async () => {
  loading.value = true
  try {
    const res: any = await getRoleList(queryParams)
    roleList.value = res.list
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  queryParams.roleName = ''
  queryParams.roleKey = ''
  handleQuery()
}

const handleStatusChange = async (row: any) => {
  try {
    await changeRoleStatus(row.id, row.status)
    ElMessage.success(t('common.success'))
  } catch {
    row.status = row.status === 1 ? 0 : 1
  }
}

// 新增/编辑角色逻辑
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const roleFormRef = ref<FormInstance>()
const form = reactive<any>({
  id: undefined,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 1,
  remark: ''
})

const rules = reactive<FormRules>({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleKey: [{ required: true, message: '请输入权限字符', trigger: 'blur' }]
})

const handleAdd = () => {
  dialogTitle.value = t('system.role.add')
  Object.assign(form, { id: undefined, roleName: '', roleKey: '', roleSort: 0, status: 1, remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = t('common.edit')
  Object.assign(form, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!roleFormRef.value) return
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (form.id) {
          await updateRole(form)
          ElMessage.success('修改成功')
        } else {
          await addRole(form)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        handleQuery()
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除角色 [${row.roleName}] 吗?`,
    t('common.tip'),
    { type: 'warning' }
  ).then(async () => {
    await deleteRole(row.id)
    ElMessage.success(t('common.success'))
    handleQuery()
  })
}

// 权限分配逻辑
const permVisible = ref(false)
const currentRole = ref<any>(null)
const menuOptions = ref<any[]>([])
const menuTreeRef = ref<any>(null)

const handlePermission = async (row: any) => {
  currentRole.value = row
  permVisible.value = true
  
  // 加载菜单树
  if (menuOptions.value.length === 0) {
    const res: any = await getMenuList()
    menuOptions.value = res
  }

  // 加载该角色已有的权限
  const resIds: any = await getRoleMenuIds(row.id)
  nextTick(() => {
    menuTreeRef.value?.setCheckedKeys(resIds)
  })
}

const submitPermission = () => {
  ElMessage.success(t('common.success'))
  permVisible.value = false
}

onMounted(() => {
  handleQuery()
})
</script>

