<template>
  <div class="finance-container p-4">
    <el-row :gutter="20">
      <!-- 资产概览 -->
      <el-col :span="16">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="flex-between">
              <span class="font-bold">资产构成占比</span>
              <el-button type="primary" size="small" @click="handleAddAsset">
                <i class="i-ep-plus mr-1" />资产登记
              </el-button>
            </div>
          </template>
          <div ref="pieChartRef" class="h-[350px]" />
        </el-card>
      </el-col>
      
      <!-- 快捷统计 -->
      <el-col :span="8">
        <el-card shadow="hover" class="h-full mb-4">
          <template #header>
            <span class="font-bold">账户摘要</span>
          </template>
          <div class="space-y-6">
            <div v-for="item in stats" :key="item.label" class="flex-between">
              <span class="text-gray-500">{{ item.label }}</span>
              <span class="text-xl font-bold" :class="item.color">{{ item.value }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 收益波动曲线 -->
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span class="font-bold">收益率波动曲线 (近30天)</span>
          </template>
          <div ref="lineChartRef" class="h-[350px]" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 资产登记弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增资产登记" width="400px">
      <el-form :model="assetForm" label-width="80px">
        <el-form-item label="资产名称">
          <el-input v-model="assetForm.name" placeholder="如: 腾讯控股" />
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="assetForm.type" placeholder="请选择类型" class="w-full">
            <el-option label="股票" value="stock" />
            <el-option label="基金" value="fund" />
            <el-option label="现金/货币基金" value="cash" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="持有金额">
          <el-input-number v-model="assetForm.value" :min="0" class="!w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAsset">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useDark } from '@vueuse/core'

const isDark = useDark()
const pieChartRef = ref()
const lineChartRef = ref()
let pieChart: echarts.ECharts | null = null
let lineChart: echarts.ECharts | null = null

const stats = [
  { label: '总资产 (CNY)', value: '¥ 1,245,600.00', color: '' },
  { label: '本月收益', value: '+ ¥ 12,400.00', color: 'text-green-500' },
  { label: '累计盈余', value: '+ 15.4%', color: 'text-green-500' },
  { label: '风险等级', value: '中等偏高', color: 'text-orange-500' }
]

const dialogVisible = ref(false)
const assetForm = ref({
  name: '',
  type: 'stock',
  value: 0
})

const handleAddAsset = () => {
  dialogVisible.value = true
}

const submitAsset = () => {
  dialogVisible.value = false
  // 此处逻辑在实际开发中应调用 API
}

const initCharts = () => {
  const theme = isDark.value ? 'dark' : ''
  if (!pieChart) pieChart = echarts.init(pieChartRef.value, theme)
  if (!lineChart) lineChart = echarts.init(lineChartRef.value, theme)

  pieChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%', left: 'center', textStyle: { color: isDark.value ? '#ccc' : '#333' } },
    series: [
      {
        name: '资产占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark.value ? '#121212' : '#fff', // 动态边框色
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold' }
        },
        data: [
          { value: 650000, name: '权益类 (股票/基金)' },
          { value: 300000, name: '固定收益类' },
          { value: 200000, name: '现金管理' },
          { value: 95600, name: '其他资产' }
        ]
      }
    ]
  })

  lineChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 30 }, (_, i) => `03-${i + 1}`),
      axisLabel: { color: isDark.value ? '#ccc' : '#666' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value} %', color: isDark.value ? '#ccc' : '#666' },
      splitLine: { lineStyle: { color: isDark.value ? '#333' : '#eee' } }
    },
    series: [
      {
        name: '收益率',
        type: 'line',
        smooth: true,
        data: Array.from({ length: 30 }, () => (Math.random() * 5 + 10).toFixed(2)),
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0)' }
          ])
        },
        itemStyle: { color: '#409EFF' }
      }
    ]
  })
}

// 监听主题变化，刷新图表
watch(isDark, () => {
  if (pieChart) {
    pieChart.dispose()
    pieChart = null
  }
  if (lineChart) {
    lineChart.dispose()
    lineChart = null
  }
  initCharts()
})

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  lineChart?.dispose()
})

const handleResize = () => {
  pieChart?.resize()
  lineChart?.resize()
}
</script>

<style scoped lang="scss">
.finance-container {
  overflow-x: hidden;
}
</style>
