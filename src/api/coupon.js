import request from '@/utils/request'

export function getcouponList(params) {
  return request({
    url: '/coupon',
    method: 'get',
    params
  })
}



export function postcouponList(data) {
  return request({
    url: '/coupon',
    method: 'post',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}

export function deletecoupon(data) {
  return request({
    url: '/coupon/'+data.id,
    method: 'delete'
  })
}

export function putcoupon(id,data) {
  return request({
    url: '/coupon/'+id,
    method: 'put',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}

export function shangxiancoupon(data) {
  return request({
    url: '/coupon/'+data.id+'/online',
    method: 'put',
  })
}

export function getzhiding() {
  return request({
    url: '/ontopcoupon',
    method: 'get',
  })
}

export function putzhiding(data) {
  return request({
    url: '/ontopcoupon/'+data.id,
    method: 'put',
    data
  })
}

export function deletezhiding(data) {
  return request({
    url: '/ontopcoupon/'+data.id,
    method: 'delete',
  })
}