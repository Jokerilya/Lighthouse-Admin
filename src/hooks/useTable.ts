import { ref, reactive, onMounted } from 'vue'

/**
 * 通用表格逻辑封装
 * @param api 获取数据的接口函数
 * @param params 初始查询参数
 */
export function useTable(api: (params: any) => Promise<any>, params: any = {}) {
  // 数据列表
  const tableData = ref([])
  // 加载状态
  const loading = ref(false)
  // 总条数
  const total = ref(0)

  // 分页数据
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10
  })

  // 查询参数
  const queryParams = reactive({ ...params })

  /**
   * 获取表格数据
   */
  const getList = async () => {
    loading.value = true
    try {
      const res = await api({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...queryParams
      })
      tableData.value = res.list || []
      total.value = res.total || 0
    } catch (error) {
      console.error('Fetch table data failed:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 查询
   */
  const handleQuery = () => {
    pagination.currentPage = 1
    getList()
  }

  /**
   * 重置
   */
  const handleReset = (formEl: any) => {
    if (formEl) formEl.resetFields()
    // 清空 queryParams 除了初始值以外的属性（或者简单重置回初始值）
    Object.keys(queryParams).forEach(key => {
      queryParams[key] = params[key] !== undefined ? params[key] : ''
    })
    handleQuery()
  }

  /**
   * 页码改变
   */
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    getList()
  }

  /**
   * 当前页改变
   */
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    getList()
  }

  // 初始加载
  onMounted(() => {
    getList()
  })

  return {
    tableData,
    loading,
    total,
    pagination,
    queryParams,
    getList,
    handleQuery,
    handleReset,
    handleSizeChange,
    handleCurrentChange
  }
}
