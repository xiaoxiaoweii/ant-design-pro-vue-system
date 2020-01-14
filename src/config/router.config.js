// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// 导航菜单
export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/planManagement',
    children: [
      // dashboard
      {
        path: '/planManagement',
        name: 'planManagement',
        redirect: '/planManagement/RequireList',
        component: RouteView,
        meta: { title: '', keepAlive: true, icon: 'form', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/planManagement/RequireList',
            name: 'RequireList',
            component: () => import('@/views/planManagement/require/1'),
            meta: { title: '计划管理', keepAlive: false, permission: [ 'dashboard' ] }
          }
        ]
      }  
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    // redirect: '/user/login',
    redirect: '/user/empower',
    hidden: true,
    children: [
      {
        path: 'empower',
        name: 'empower',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Empower')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/logout',
    name:'logout',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/user/logout')
  },
  {
    path: '/apppage',
    name:'apppage',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/user/apppage')
  },
  {
    path: '/relogin',
    name:'relogin',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/user/relogin')
  },
  {
    path: '/version',
    name: 'version',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Version')
  },
  {
    path: '/404',
    //  component: () => import(/* webpackChunkName: "fail" */ '@/views/user/logout')
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
