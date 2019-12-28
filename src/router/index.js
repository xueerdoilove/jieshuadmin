import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    name: 'index',
    redirect: '/pachong',
    meta: {
      title: '书库管理',
      icon: 'dashboard'
    },
    children: [{
        path: 'pachong',
        name: 'Pachong',
        component: () => import('@/views/pachong/index'),
        meta: {
          title: '爬虫信息'
        }
      },
      {
        path: 'bookLibrary',
        name: 'bookLibrary',
        redirect: 'booklist',
        component: () => import('@/views/bookLibrary/index'),
        meta: {
          title: '书库信息'
        },
        children: [{
          path: 'bookdetail',
          name: 'bookdetail',
          component: () => import('@/views/bookLibrary/bookdetail'),
          meta: {
            title: '图书详情'
          },
          hidden:true
        }, {
          path: 'booklist',
          name: 'booklist',
          component: () => import('@/views/bookLibrary/booklist'),
          meta: {
            title: '图书列表'
          },
        }]
      }

    ]
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '优惠券',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'couponlist',
      component: () => import('@/views/coupon/index'),
      meta: {
        title: '优惠券列表'
      }
    }],

  },
  {
    path: '/vip',
    name: 'vip',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '会员设置',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'viplist',
      component: () => import('@/views/vip/index'),
      meta: {
        title: '会员类型列表'
      }
    }],

  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '推荐书单',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'recommendlist',
      component: () => import('@/views/recommend/index'),
      meta: {
        title: '书单列表'
      }
    }, {
      path: 'onerecommend',
      name: 'onerecommend',
      component: () => import('@/views/recommend/booklist'),
      meta: {
        title: '书籍列表'
      },
      hidden: true
    }],

  },
  {
    path: '/bookstore',
    name: 'bookstore',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '书店管理',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'bookstorelist',
      component: () => import('@/views/bookstore/index'),
      meta: {
        title: '书店列表'
      }
    }, {
      path: 'storedetail',
      name: 'storedetail',
      component: () => import('@/views/bookstore/storedetail'),
      meta: {
        title: '书店详情'
      },
      hidden: true
    }],

  },
  {
    path: '/incomestats',
    name: 'incomestats',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '账户管理',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'incomestatslist',
      component: () => import('@/views/incomestats/index'),
      meta: {
        title: '账户列表'
      }
    }],

  },
  {
    path: '/order',
    name: 'order',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '订单',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'orderlist',
      component: () => import('@/views/order/index'),
      meta: {
        title: '订单列表'
      }
    }],

  },
  {
    path: '/feedback',
    name: 'feedback',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '用户反馈',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'feedbacklist',
      component: () => import('@/views/feedback/index'),
      meta: {
        title: '用户反馈列表'
      }
    }],
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: 'list',
    meta: {
      title: '系统设置',
      icon: 'form'
    },
    children: [{
      path: 'list',
      name: 'baseconfiglist',
      component: () => import('@/views/system/index'),
      meta: {
        title: '基本配置列表'
      }
    }],

  },
  {
    path: '/usercontrol',
    name: 'usercontrol',
    component: Layout,
    redirect: 'userlist',
    meta: {
      title: '用户管理',
      icon: 'form'
    },
    children: [{
      path: 'userlist',
      name: 'userlist',
      component: () => import('@/views/user/index'),
      meta: {
        title: '管理员列表'
      }
    }],

  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
