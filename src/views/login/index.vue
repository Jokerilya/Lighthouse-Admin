<template>
  <div class="login-container flex-center full-page">
    <div class="login-card p-8 bg-white rounded-2xl shadow-xl w-100 animate-fade-in">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-primary tracking-wider">Lighthouse Admin</h2>
        <p class="text-gray-400 mt-2">个人后台管理系统</p>
      </div>

      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" size="large">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名 (admin)" 
            prefix-icon="i-ep-user"
          />
        </el-form-item>
        <el-form-item prop="password" class="mt-4">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码 (123456)" 
            show-password
            prefix-icon="i-ep-lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <div class="mt-8">
          <el-button 
            type="primary" 
            class="w-full !rounded-xl !h-12 !text-lg" 
            :loading="loading" 
            @click="handleLogin"
          >
            登 录
          </el-button>
        </div>
      </el-form>

      <div class="mt-6 text-center text-sm text-gray-400">
        <p>测试账号: admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/user'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单校验规则
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

/**
 * 登录处理逻辑
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用 Mock 登录接口
        const data: any = await login(loginForm)

        ElMessage.success('登录成功')
        // 存储 Token 和用户信息
        userStore.setToken(data.token)
        userStore.setUserInfo({
          username: data.username,
          avatar: '',
          roles: data.roles
        })
        
        // 跳转到首页
        router.push('/')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  background: linear-gradient(135deg, #f5f7f9 0%, #e4e7ed 100%);
}

.login-card {
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
