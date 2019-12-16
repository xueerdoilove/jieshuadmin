import request from '@/utils/request'

export function getvipList(params) {
  return request({
    url: '/membership',
    method: 'get',
    params
  })
}
export function putvip(id,data) {
  return request({
    url: '/membership/'+id,
    method: 'put',
    data
  })
}
