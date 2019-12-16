import request from '@/utils/request'

export function getbookList(params) {
  return request({
    url: '/bookcip',
    method: 'get',
    params
  })
}
