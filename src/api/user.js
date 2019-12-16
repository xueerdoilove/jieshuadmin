import request from '@/utils/request'
// import qs from 'qs'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/myprofile',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function mybookstore() {
  return request({
    url: '/mybookstore',
    method: 'get'
  })
}


export function resetname(data) {
  return request({
    url: '/resetname',
    method: 'put',
    data
  })
}


export function resetpassword(data) {
  return request({
    url: '/resetpassword',
    method: 'put',
    data
  })
}