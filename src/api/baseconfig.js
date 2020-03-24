import request from '@/utils/request'

export function getbaseconfiglist(params) {
  return request({
    url: '/baseconfig',
    method: 'get',
    params
  })
}

export function putbaseconfig(id,data) {
  return request({
    url: '/baseconfig/'+id,
    method: 'put',
    data
  })
}

// 查询菜单列表 menu?&state=1&menuType=1&sk=time&so=ase&page=1&pageSize=2
// state：     状态：0隐藏,1显示（默认值：1）     
// menuType：  菜单类型：门店管理菜单(0),系统管理菜单(1)  （默认值：-1）    
export function getmenulist(params) {
  return request({
    url: '/menu',
    method: 'get',
    params
  })
}

// user/{userId}/menu
// {
//   menuIdList:[1,2,3,4,5],    -> 菜单id列表 
//   bookStoreId:""             -> bookStoreId > 0 是门店管理员
// }：

export function postmenu(id,data) {
  return request({
    url: '/user/'+id+'/menu',
    method: 'post',
    data
  })
}

export function delmenu(data) {
  return request({
    url: '/user/'+data.userid+'/menu/'+data.menuid,
    method: 'delete',
  })
}

export function delmenuall(data) {
  return request({
    url: '/user/'+data.userid+'/menu',
    method: 'delete',
  })
}

// 获取联系信息配置
export function getcontactcfg(params) {
  return request({
    url: '/contactcfg/1',
    method: 'get',
    params
  })
}

export function putcontactcfg(data) {
  return request({
    url: '/contactcfg/1' ,
    method: 'put',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}

// 帮助
export function gethelpcfg(params) {
  return request({
    url: '/helpcfg/1',
    method: 'get',
    params
  })
}

export function puthelpcfg(data) {
  return request({
    url: '/helpcfg/1',
    method: 'put',
    data
  })
}


//管理员查询banner api/admin/ads?adsType=0&state=2&sk=x&so=x&page=1&pageSize

export function getbannerlist(params) {
  return request({
    url: '/admin/ads',
    method: 'get',
    params
  })
}

export function postbannerlist(data) {
  return request({
    url: '/admin/ads',
    method: 'post',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}
export function putbanner(data) {
  return request({
    url: '/admin/ads/'+data.id,
    method: 'put',
    data
  })
}

export function putbannerimg(id,data) {
  console.log(id)
  return request({
    url: '/admin/ads/'+id+'/picture',
    method: 'put',
    async: false,  
    cache: false,  
    contentType: false,  
    processData: false, 
    headers:{'Content-Type':'multipart/form-data'},
    data
  })
}

//api/admin/ads/{id}/state
export function putadsstate(id,data) {
  return request({
    url: '/admin/ads/'+id+'/state',
    method: 'put',
    data
  })
}

export function deladsstate(id,data) {
  return request({
    url: '/admin/ads/'+id,
    method: 'delete',
    data
  })
}