import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name

      if (hasGetUserInfo) {
        console.log(1111, store.getters.permission_routers.length)
        if (store.getters.permission_routers.length == 4) { // 如果没有菜单列表
          store.dispatch('GenerateRoutes', {
            perms: JSON.parse(localStorage.getItem('mymenu')) || [],
            roles: localStorage.getItem('roleset') || '1'
          }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({
              ...to,
              replace: true
            }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        } else {
          next()
        }
      } else {
        console.log(222, store.getters.permission_routers.length)
        try {
          // get user info
          await store.dispatch('user/getInfo')

          if (store.getters.permission_routers.length == 4) { // 如果没有菜单列表

            store.dispatch('GenerateRoutes', {
              perms: JSON.parse(localStorage.getItem('mymenu')) || [],
              roles: localStorage.getItem('roleset') || '1'
            }).then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({
                ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          } else {
            if (router.options.routes.length == 4) {
              router.addRoutes(store.getters.addRouters)
            }
            next()
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          next(`/login`)
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }





    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
