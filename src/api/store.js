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

//api/bookstore/{bookStoreId}/resource?state=1&sk=xx&so=xx&page=1&pageSize=2
export function getresource(params) {
  return request({
    url: '/bookstore/'+params.id+'/resource',
    method: 'get',
    params
  })
}
// /api/resource/{id} 删除图片
export function delresource(params) {
  return request({
    url: '/resource/'+params.id,
    method: 'delete',
    params
  })
}
// 上传书店封面图
export function postpictrue(id,data) {
  return request({
    url: '/bookstore/'+id+'/resource',
    method: 'post',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}
// 获取书店图书数量 bookstore/2/bookcnt?id=2
export function getbookcnt(params) {
  return request({
    url: '/bookstore/'+params.id+'/bookcnt',
    method: 'get',
    params
  })
}

// 获取书店的书列表 bookcipbystore?bookStoreId=2&page=1&pageSize=200
export function getbookcipbystore(params) {
  return request({
    url: '/bookcipbystore',
    method: 'get',
    params
  })
}