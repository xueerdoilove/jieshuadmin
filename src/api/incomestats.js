import request from '@/utils/request'
//incomestats?bookStoreId={bookStoreId}&state={state}&sk=xx&so=xx&page=1&pageSize=1
// 收入统计列表
export function getincomestatslist(params) {
  return request({
    url: '/incomestats',
    method: 'get',
    params
  })
}

// getincomelist
export function getincomelist(params) {
  return request({
    url: '/bookstore/'+params.bookStoreId+'/income',
    method: 'get',
    params
  })
}


