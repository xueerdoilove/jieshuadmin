import request from '@/utils/request'

export function getordersum(params) {
  return request({
    url: '/ordersum',
    method: 'get',
    params
  })
}

// api/ordersumapprove?internalNo={internalNo}
export function getordersumapprove(params) {
  return request({
    url: '/ordersumapprove',
    method: 'get',
    params
  })
}

//ordersum
export function getordersumByid(params) {
  return request({
    url: '/ordersum/'+params.id,
    method: 'get',
  })
}

//bookorder/{id}/bind {qrCode : 12345}
export function bindbookorderarcode(data) {
  return request({
    url: '/bookorder/'+data.id+'/bind',
    method: 'put',
    data
  })
}

// 发货 /ordersum/{ordersumid}/express

export function sendbook(data) {
  return request({
    url: '/ordersum/'+data.id+'/express',
    method: 'put',
    data
  })
}
// 物流 ordersum/117/tracktrace?id=117&sk=time&so=desc
export function gettracktrace(params) {
  return request({
    url: '/ordersum/'+params.id+'/tracktrace',
    method: 'get',
    params
  })
}
