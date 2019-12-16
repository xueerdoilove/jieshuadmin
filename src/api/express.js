import request from '@/utils/request'

export function getkuaidilist(params) {
  return request({
    url: '/express',
    method: 'get',
    params
  })
}

