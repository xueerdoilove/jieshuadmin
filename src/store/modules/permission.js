import {
  asyncRouters,
  constantRouters
} from '@/router'
// import store from '@/store'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(perms, route) { //判断是否有权限
  if (route.meta && route.meta.perms) {
    return perms.some(perm => route.meta.perms.includes(perm))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouters
 * @param roles
 */
function filterAsyncRouter(routes, perms) { //过滤没有权限的列表 循环过滤 直到没有子路由
  var arr = []
  var arr1 = {n1:false,n2:false}
  if(!perms){
    return []
  }
  
  perms.forEach(item => {
    switch (item.seq) {
      case 1:
        // 爬虫
         arr1.n1=true
        break;
      case 2:
        // 书库信息
        arr1.n2=true
        break;
      case 3:
        // 门店管理
        routes.forEach(route => {
          if (route.name == 'bookstore') {
            arr.push(route)
          }
        })
        break;
      case 4:
        // 订单管理
        routes.forEach(route => {
          if (route.name == 'order') {
            arr.push(route)
          }
        })
        break;
      case 5:
        // 账户管理
        routes.forEach(route => {
          if (route.name == 'incomestats') {
            arr.push(route)
          }
        })
        break;
      case 6:
        // 优惠券
        routes.forEach(route => {
          if (route.name == 'coupon') {
            arr.push(route)
          }
        })
        break;

      case 8:
        // 本周书单
        routes.forEach(route => {
          if (route.name == 'recommend') {
            arr.push(route)
          }
        })
        break;

      case 12:
        // vip
        routes.forEach(route => {
          if (route.name == 'vip') {
            arr.push(route)
          }
        })
        break;
      case 13:
        // 用户反馈
        routes.forEach(route => {
          if (route.name == 'feedback') {
            arr.push(route)
          }
        })
        break;
      case 7:
        // 权限管理
        routes.forEach(route => {
          if (route.name == 'permission') {
            arr.push(route)
          }
        })
        break;
      case 10:
        // 用户管理
        routes.forEach(route => {
          if (route.name == 'user') {
            arr.push(route)
          }
        })
        break;
      case 11:
        // 授权管理
         
        break;
      case 9:
        // 系统设置
        routes.forEach(route => {
          if (route.name == 'system') {
            arr.push(route)
          }
        })
        break;
      default:

    }
  })
  return {routers:arr,shuku:arr1}
   
}

const permission = {
  state: {
    routers: constantRouters,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routerdata) => { //保存动态路由时 将静态路由和动态路由合并
      if(routerdata.shuku.n1&&routerdata.shuku.n2){
        state.routers.forEach(item =>{
          if(item.name=='skbook'){
            item.hidden = false;
            item.children[0].hidden = false;
            item.children[1].hidden = false;
          }
        })
      }
      if(routerdata.shuku.n1&&!routerdata.shuku.n2){
        state.routers.forEach(item =>{
          if(item.name=='skbook'){
            item.hidden = false;
            item.children[0].hidden = false;
            item.children[1].hidden = true;
          }
        })
      }
      if(!routerdata.shuku.n1&&routerdata.shuku.n2){
        state.routers.forEach(item =>{
          if(item.name=='skbook'){
            item.hidden = false;
            item.children[0].hidden = true;
            item.children[1].hidden = false;
          }
        })
      }
      state.addRouters = routerdata.routers
      state.routers = constantRouters.concat(routerdata.routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const roles = data.roles
        const perms = data.perms
        let accessedRouters
        if (roles) {
          if (roles && roles.search('4') != -1) { //如果是admin角色 加载所有动态路由
            accessedRouters = {routers:asyncRouters,shuku:{n1:true,n2:true}}
          } else { //如果不是admin角色 则加载过滤后的动态路由
            accessedRouters = filterAsyncRouter(asyncRouters, perms)
          }

          commit('SET_ROUTERS', accessedRouters) //保存路由
        }
        resolve()
      })
    }
  }
}

export default permission
