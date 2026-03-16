<template>
  <div 
    class="flex items-center cursor-pointer text-xl hover:text-primary transition-colors"
    @click="toggleDark()"
  >
    <div :class="isDark ? 'i-ep-moon' : 'i-ep-sunny'" />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

/**
 * 暗黑模式切换组件
 * 使用 VueUse 的 useDark 实现，自动关联 html 标签的 dark 类名
 */
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
