import request from '@/utils/request'

export function getbookList(params) {
  return request({
    url: '/bookcip',
    method: 'get',
    params
  })
}

// 查询单本书的详情
export function getonebook(id) {
  return request({
    url: '/bookcip/'+id,
    method: 'get',
    
  })
}
// 下架图书
export function delbook(id) {
  return request({
    url: '/bookcipstore/'+id,
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

// 上架 门店图书 api/bookcipstore/{bookcipstoreId}
export function putbookcipstore( bookcipstoreId ) {
  return request({
    url: '/bookcipstore/'+bookcipstoreId,
    method: 'put',
  })
}
// bookstore/{id}/bookcip/{id} 查询 书店的库存
export function getbookstorekucun(params) {
  return request({
    url: '/bookstore/'+params.bookstoreid+'/bookcip/'+params.bookid,
    method: 'get',
    params
  })
}
// 查询书店里面的书目
export function bookcipbystore(params) {
  return request({
    url: '/bookstore/'+params.bookStoreId+'/bookcip',
    method: 'get',
    params
  })
}

// 查询书的 具体编号列表 bookcip/{id}/bookstore/{id}/book

export function getbookqrcodelist(params) {
  return request({
    url: '/bookcip/'+params.bookid+'/bookstore/'+params.bookstoreid+'/book',
    method: 'get',
    params
  })
}
// 修改书 putbookcip

export function putbookcip(id,data) {
  return request({
    url: '/bookcip/'+id,
    method: 'put',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}

// 新建postbookcip
export function postbookcip(data) {
  return request({
    url: '/bookcip',
    method: 'post',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}



//获取简介
export function getinfo(params) {
  return request({
    url: '/bookcip/'+params.bookCipId+'/info',
    method: 'get',
  })
}
// introduction:''
export function setinfo(data) {
  return request({
    url: '/bookcip/'+data.bookCipId+'/info',
    method: data.type,
    data
  })
}

//获取作者简介
export function getauthorinfo(params) {
  return request({
    url: '/bookcip/'+params.bookCipId+'/authorinfo',
    method: 'get',
  })
}
// introduction:''
export function setauthorinfo(data) {
  return request({
    url: '/bookcip/'+data.bookCipId+'/authorinfo',
    method: data.type,
    data
  })
}

//获取目录简介
export function getcontents(params) {
  return request({
    url: '/bookcip/'+params.bookCipId+'/contents',
    method: 'get',
  })
}
// introduction:''
export function setcontents(data) {
  return request({
    url: '/bookcip/'+data.bookCipId+'/contents',
    method: data.type,
    data
  })
}