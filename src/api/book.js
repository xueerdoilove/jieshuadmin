import request from '@/utils/request'

export function getbookList(params) {
  return request({
    url: '/bookcip',
    method: 'get',
    params
  })
}
// 下架图书
export function delbook(id) {
  return request({
    url: '/bookcip/'+id,
    method: 'delete',
  })
}
// 批量上架 bookciponline  bookCipIdList:[1,2,3,4,5,6]              -> 书目信息id列表
export function putbookonline(data) {
  return request({
    url: '/bookciponline',
    method: 'put',
    data
  })
}

export function bookcipsearch(params) {
  return request({
    url: '/bookcipsearch',
    method: 'get',
    params
  })
}


export function bookcipbystore(params) {
  return request({
    url: '/bookcipbystore',
    method: 'get',
    params
  })
}
