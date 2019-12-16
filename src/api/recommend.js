import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/recommendlist',
    method: 'get',
    params
  })
}

export function getrecommendbookciplist(params) {
  return request({
    url: '/recommendlist/'+params.id+'/recommendbookcip',
    method: 'get',
    params
  })
}
