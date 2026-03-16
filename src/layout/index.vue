<template>
  <el-layout class="layout-wrapper h-screen w-full flex overflow-hidden">
    <!-- 侧边栏 -->
    <aside 
      class="sidebar-container bg-[#304156] transition-all duration-300 relative border-r border-[#ffffff10]"
      :class="appStore.sidebar.opened ? 'w-64' : 'w-16'"
    >
      <div class="logo-container h-14 flex-center text-white overflow-hidden whitespace-nowrap px-4 border-b border-[#ffffff10]">
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
          <template #title>{{ $t('menu.dashboard') }}</template>
        </el-menu-item>
        <el-sub-menu index="task">
          <template #title>
            <i class="i-ep-list mr-2" />
            <span>{{ $t('menu.personal') }}</span>
          </template>
          <el-menu-item index="/todo">{{ $t('menu.todo') }}</el-menu-item>
          <el-menu-item index="/notebook">{{ $t('menu.notebook') }}</el-menu-item>
          <el-menu-item index="/finance">{{ $t('menu.finance') }}</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="system">
          <template #title>
            <i class="i-ep-setting mr-2" />
            <span>{{ $t('menu.system') }}</span>
          </template>
          <el-menu-item index="/system/user">{{ $t('menu.user') }}</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <!-- 主体内容 -->
    <main class="main-container flex-1 flex flex-col min-w-0 bg-[var(--el-bg-color-page)] relative">
      <!-- 顶栏 -->
      <header class="header-container h-14 bg-[var(--el-bg-color)] border-b border-[var(--el-border-color-lighter)] shadow-sm flex-between px-4 z-10 shrink-0">
        <div class="flex items-center">
          <div 
            class="text-xl cursor-pointer hover:text-primary transition-colors pr-4" 
            @click="appStore.toggleSidebar"
          >
            <div :class="appStore.sidebar.opened ? 'i-ep-fold' : 'i-ep-expand'" />
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center space-x-4">
          <div class="i-ep-search text-xl cursor-pointer hover:text-primary transition-colors" @click="spotlightRef?.open()" :title="$t('common.search') + ' (Ctrl+Shift+K)'" />
          
          <Notification />
          
          <!-- 语言切换 -->
          <el-dropdown trigger="click" @command="handleSetLanguage">
            <div class="i-ep-comment text-xl cursor-pointer hover:text-primary transition-colors" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :disabled="appLocale === 'zh-CN'" command="zh-CN">简体中文</el-dropdown-item>
                <el-dropdown-item :disabled="appLocale === 'en-US'" command="en-US">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <ThemeSwitch />
          <el-dropdown trigger="click">
            <div class="flex items-center cursor-pointer">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar || 'https://avatars.githubusercontent.com/u/1?v=4'" class="mr-2" />
              <span class="hidden sm:inline-block text-sm font-medium">{{ userStore.userInfo?.nickname || 'Admin' }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ $t('common.profile') }}</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">{{ $t('common.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 多页签 -->
      <TagsView />

      <!-- 内容区 -->
      <section class="app-main flex-1 p-4 overflow-y-auto overflow-x-hidden relative">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="tagsViewStore.cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </section>

      <!-- 全局搜索弹窗 -->
      <spotlight ref="spotlightRef" />
    </main>
  </el-layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { useTagsViewStore } from '@/store/tagsView'
import { useWatermark } from '@/hooks/useWatermark'
import { ElMessageBox, ElMessage } from 'element-plus'
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import Spotlight from '@/components/Spotlight/index.vue'
import TagsView from './components/TagsView/index.vue'
import Notification from './components/Notification/index.vue'

const { locale: appLocale } = useI18n()
const { setWatermark } = useWatermark()
const spotlightRef = ref()

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const tagsViewStore = useTagsViewStore()

const activeMenu = computed(() => route.path)

onMounted(() => {
  // 应用全局水印
  const name = userStore.userInfo?.nickname || 'Lighthouse Admin'
  setWatermark(name)
})

/**
 * 退出登录
 */
const handleLogout = () => {
  ElMessageBox.confirm('确定注销并退出系统吗?', '提示', {
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}

/**
 * 切换语言
 */
const handleSetLanguage = (lang: string) => {
  appLocale.value = lang
  localStorage.setItem('lang', lang)
  ElMessage.success(lang === 'zh-CN' ? '语言切换成功' : 'Language switched')
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
