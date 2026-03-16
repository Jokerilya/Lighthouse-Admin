<template>
  <div class="flex-center full-page flex-col">
    <h1 class="text-9xl font-bold text-primary opacity-20">404</h1>
    <p class="text-2xl text-gray-500 mt-4">抱歉，您访问的页面不存在</p>
    <el-button type="primary" class="mt-8" @click="$router.push('/')">
      返回首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
/**
 * 404 错误页面
 */
</script>
