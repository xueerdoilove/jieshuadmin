import request from '@/utils/request'

export function getextrabooklist(params) {
  return request({
    url: '/extrabook',
    method: 'get',
    params
  })
}

export function solveextrabook(data) {
  return request({
    url: '/extrabook/'+data.id+'/solve',
    method: 'put',
  })
}

export function closeextrabook(data) {
  return request({
    url: '/extrabook/'+data.id+'/close',
    method: 'put',
  })
}