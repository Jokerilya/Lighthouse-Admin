<template>
  <el-layout class="layout-wrapper h-screen w-full flex overflow-hidden">
    <!-- 侧边栏 -->
    <aside 
      class="sidebar-container bg-[#304156] transition-all duration-300 relative"
      :class="appStore.sidebar.opened ? 'w-64' : 'w-16'"
    >
      <div class="logo-container h-16 flex-center text-white overflow-hidden whitespace-nowrap px-4 border-b border-white border-opacity-10">
        <div class="i-ep-opportunity text-2xl mr-2 text-yellow-400 shrink-0" />
        <span v-show="appStore.sidebar.opened" class="font-bold text-lg tracking-wide uppercase">Lighthouse</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="!appStore.sidebar.opened"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        unique-opened
        router
        class="border-none !w-full"
      >
        <el-menu-item index="/dashboard">
          <i class="i-ep-monitor mr-2" />
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-sub-menu index="task">
          <template #title>
            <i class="i-ep-list mr-2" />
            <span>个人管理</span>
          </template>
          <el-menu-item index="/todo">任务清单</el-menu-item>
          <el-menu-item index="/notebook">个人周报</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="system">
          <template #title>
            <i class="i-ep-setting mr-2" />
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <!-- 主体内容 -->
    <main class="main-container flex-1 flex flex-col min-w-0 bg-[#f5f7f9] relative">
      <!-- 顶栏 -->
      <header class="header-container h-14 bg-white shadow-sm flex-between px-4 z-10 shrink-0">
        <div class="flex items-center">
          <div 
            class="text-xl cursor-pointer hover:text-primary transition-colors pr-4" 
            :class="appStore.sidebar.opened ? 'i-ep-fold' : 'i-ep-expand'"
            @click="appStore.toggleSidebar"
          />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center space-x-4">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="flex items-center cursor-pointer">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar" class="mr-2" />
              <span class="text-sm font-medium">{{ userStore.userInfo?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 路由视口 -->
      <section class="app-main flex-1 p-4 overflow-y-auto overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
    </main>
  </el-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定注销并退出系统吗?', '提示', {
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
      ElMessage.success('已退出登录')
    })
  }
}
</script>

<style scoped lang="scss">
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

:deep(.el-menu--collapse) {
  .el-sub-menu__title span {
    display: none;
  }
}
</style>
