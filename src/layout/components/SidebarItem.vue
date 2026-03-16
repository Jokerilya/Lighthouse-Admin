<template>
  <!-- 仅渲染目录 (M) 和 菜单 (C)，按钮 (F) 类型不显示在侧边栏 -->
  <div v-if="!item.hidden && (item.menuType === 'M' || item.menuType === 'C')">
    
    <!-- 情况 A: 菜单项 (C)，没有子菜单 -->
    <el-menu-item 
      v-if="item.menuType === 'C'" 
      :index="resolvePath(item.path)"
    >
      <i v-if="item.icon" :class="[item.icon, 'mr-2']" />
      <template #title>{{ $t(item.menuName) }}</template>
    </el-menu-item>

    <!-- 情况 B: 目录项 (M)，可能包含子菜单 -->
    <el-sub-menu v-else :index="resolvePath(item.path || '')">
      <template #title>
        <i v-if="item.icon" :class="[item.icon, 'mr-2']" />
        <span>{{ $t(item.menuName) }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.id || child.path"
        :item="child"
        :base-path="resolvePath(item.path || '')"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any
  basePath?: string
}>()

/**
 * 解析合并路径
 */
const resolvePath = (routePath: string) => {
  if (!routePath) return props.basePath || '/'
  if (routePath.startsWith('/')) {
    return routePath
  }
  if (!props.basePath) {
    return '/' + routePath
  }
  const base = props.basePath.endsWith('/') ? props.basePath : props.basePath + '/'
  return base + routePath
}
</script>
