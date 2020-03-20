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

