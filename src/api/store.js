import request from '@/utils/request'

export function bindstoreSharecode(data) {
  return request({
    url: '/bookstore/'+data.id+'/sharecode',
    method: 'put',
    data
  })
}

export function getbindstoreSharecode(data) {
  return request({
    url: '/bookstore/'+data.id+'/sharecode',
    method: 'get'
    
  })
}

export function getstoreList(params) {
  return request({
    url: '/bookstore',
    method: 'get',
    params
  })
}

export function poststore(data) {
  return request({
    url: '/bookstore',
    method: 'post',
    data
  })
}

export function putstore(data) {
  return request({
    url: '/bookstore/'+data.id,
    method: 'put',
    data
  })
}
export function deletestore(data) {
  return request({
    url: '/bookstore/'+data.id,
    method: 'delete',
    data
  })
}

export function getstorebyid(params) {
  return request({
    url: '/bookstore/'+params.id,
    method: 'get',
    
  })
}

// api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
export function getprovcity(params) {
  return request({
    url: '/provcity',
    method: 'get',
    params
  })
}

