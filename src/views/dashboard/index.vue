<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card shadow="hover" class="stat-card border-none !rounded-xl overflow-hidden relative">
          <div class="flex-between">
            <div>
              <div class="text-gray-400 text-sm mb-2 uppercase tracking-wider">{{ item.title }}</div>
              <div class="text-2xl font-bold text-gray-700">{{ item.value }}</div>
            </div>
            <div :class="[item.icon, item.color, 'text-4xl opacity-80']" />
          </div>
          <div class="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 flex items-center">
            <span class="text-green-500 font-bold mr-1">↑ {{ item.growth }}%</span>
            较昨日
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表与列表 -->
    <el-row :gutter="20" class="mt-6">
      <el-col :span="16">
        <el-card shadow="hover" class="!rounded-xl border-none">
          <template #header>
            <div class="font-bold">月度任务趋势</div>
          </template>
          <div ref="chartRef" class="w-full h-80" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="!rounded-xl border-none h-full">
          <template #header>
            <div class="flex-between">
              <span class="font-bold">近期任务计划</span>
              <el-button link type="primary" @click="$router.push('/todo')">查看全部</el-button>
            </div>
          </template>
          <div v-for="i in 5" :key="i" class="flex items-center py-3 border-b border-gray-50 last:border-none">
            <el-checkbox />
            <span class="ml-3 text-sm text-gray-600 truncate">完成 Lighthouse 系统模块开发 - {{ i }}</span>
            <el-tag size="small" type="info" class="ml-auto shrink-0">今天</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const chartRef = ref<HTMLElement>()
let myChart: echarts.ECharts | null = null

const statistics = ref([
  { title: '待办任务', value: '12', icon: 'i-ep-list', color: 'text-blue-500', growth: '12' },
  { title: '学习时长', value: '3.5h', icon: 'i-ep-timer', color: 'text-orange-500', growth: '5' },
  { title: '周报完成', value: '85%', icon: 'i-ep-document', color: 'text-green-500', growth: '10' },
  { title: '提醒事项', value: '3', icon: 'i-ep-bell', color: 'text-purple-500', growth: '0' }
])

/**
 * 初始化图表
 */
const initChart = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '完成任务数',
        type: 'line',
        smooth: true,
        data: [10, 22, 18, 25, 32, 28, 40],
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0)' }
          ])
        }
      }
    ]
  }

  myChart.setOption(option)
}

// 监听侧边栏折叠以适配图表大小
watch(() => appStore.sidebar.opened, () => {
  setTimeout(() => {
    myChart?.resize()
  }, 300)
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => myChart?.resize())
})

onUnmounted(() => {
  window.removeEventListener('resize', () => myChart?.resize())
  myChart?.dispose()
})
</script>

<style scoped lang="scss">
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
}
</style>
