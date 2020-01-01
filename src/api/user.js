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


// 获取管理员列表  useradd?userType=1&state=1&sk=x&so=x&page=1&pageSize=10

export function getuserlist(params) {
  return request({
    url: '/useradd',
    method: 'get',
    params
  })
}

// 创建管理员 useradd

export function useradd(data) {
  return request({
    url: '/useradd',
    method: 'post',
    data
  })
}


// 用户权限菜单 user/{userId}/menu
export function usermenu(params) {
  return request({
    url: '/user/'+params.id+'/menu',
    method: 'get',
  })
}

// 获取自己的权限列表 api/mymune
 
export function mymune(params) {
  return request({
    url: '/mymenu',
    method: 'get',
  })
}