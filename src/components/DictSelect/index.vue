<template>
  <el-select
    v-model="internalValue"
    :placeholder="placeholder || '请选择'"
    clearable
    v-bind="$attrs"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <template #default>
        <el-tag v-if="item.listClass" :type="item.listClass" size="small">{{ item.label }}</el-tag>
        <span v-else>{{ item.label }}</span>
      </template>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getDictDataByType } from '@/api/dict'

const props = defineProps<{
  modelValue: any
  dictType: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(props.modelValue)
const options = ref<any[]>([])

/**
 * 加载字典数据
 */
const loadDictData = async () => {
  if (!props.dictType) return
  const res: any = await getDictDataByType(props.dictType)
  options.value = res
}

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

watch(internalValue, (val) => {
  emit('update:modelValue', val)
  emit('change', val)
})

onMounted(() => {
  loadDictData()
})
</script>
