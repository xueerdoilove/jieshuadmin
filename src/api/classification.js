import request from '@/utils/request'
//parentId=-1&state=2&sk=xx&so=xx&page=1&pageSize=30
export function getcatlist(params) {
  return request({
    url: '/cat',
    method: 'get',
    params
  })
}

export function putcat(id,data) {
  return request({
    url: '/cat/'+id,
    method: 'put',
    data
  })
}


export function postcat(data) {
  return request({
    url: '/cat',
    method: 'post',
    data
  })
}

//cat/{id}/active
export function putcatactive(id) {
  return request({
    url: '/cat/'+id+'/active',
    method: 'put',
  })
}

//cat/{id}/active
export function delcat(id) {
  return request({
    url: '/cat/'+id,
    method: 'delete',
  })
}
 