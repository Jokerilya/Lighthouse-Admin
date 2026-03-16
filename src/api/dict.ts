import request from '@/utils/request'

/**
 * 获取字典类型列表
 */
export function getDictTypeList(params: any) {
  return request({
    url: '/dict/type/list',
    method: 'get',
    params
  })
}

/**
 * 根据类型获取字典数据
 */
export function getDictDataByType(type: string) {
  return request({
    url: '/dict/data/type',
    method: 'get',
    params: { type }
  })
}

/**
 * 删除字典类型
 */
export function deleteDictType(id: number) {
  return request({
    url: `/dict/type/delete/${id}`,
    method: 'delete'
  })
}
