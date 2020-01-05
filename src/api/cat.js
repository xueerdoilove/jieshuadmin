import request from '@/utils/request'

// 查询分类列表 cat?parentId=-1&state=2&sk=xx&so=xx&page=1&pageSize=30
export function getcatList (params) {
  return request({
    url: '/cat',
    method: 'get',
    params
  })
}

