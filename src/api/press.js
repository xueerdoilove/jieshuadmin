import request from '@/utils/request'
// api/pressbyname?state={state}&name={name}&sk=xx&so=xx&page=1&pageSize=2
export function getpressListbyname(params) {
  return request({
    url: '/pressbyname',
    method: 'get',
    params
  })
}
export function getpressbyid(data) {
  return request({
    url: '/press/'+data.id,
    method: 'get',
  })
}