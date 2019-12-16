import request from '@/utils/request'

export function getbaseconfiglist(params) {
  return request({
    url: '/baseconfig',
    method: 'get',
    params
  })
}

export function putbaseconfig(id,data) {
  return request({
    url: '/baseconfig/'+id,
    method: 'put',
    data
  })
}