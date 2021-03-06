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

export function delrecommendbookcip(params) {
  return request({
    url: '/recommendbookcip/'+params.id,
    method: 'delete',
  })
}
export function putrecommendbookcip(data) {
  return request({
    url: '/recommendbookcip/'+data.id,
    method: 'put',
    data
  })
}

export function addrecommendbookcip(data) {
  return request({
    url: '/recommendlist/'+data.id+'/recommendbookcip',
    method: 'post',
    data
  })
}


export function putrecommendlist(data) {
  return request({
    url: '/recommendlist/'+data.id,
    method: 'put',
    data
  })
}

export function postrecommendlist(data) {
  return request({
    url: '/recommendlist',
    method: 'post',
    data
  })
}

export function delrecommendlist(id) {
  return request({
    url: '/recommendlist/'+id,
    method: 'delete',
    
  })
}