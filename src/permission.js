import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import { openid } from '@/api/common'
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, DEFAULT_UID } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult', 'empower','logout', 'version', 'apppage'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') { // /user/login empower
      next({ path: '/dashboard/workplace' }) /* '/equipment/purchase' */
      NProgress.done()
    } else {
      // if (store.getters.roles.length === 0) {
      if (!store.getters.userInfo) {
        const value = localStorage.getItem('scope_code')
        const data = !value ? { userId: Vue.ls.get(DEFAULT_UID) } : { scope_code: value }
        store
          .dispatch('GetInfo', data)
          // .dispatch('GetInfo', { scope_code: store.state.menu_key })
          .then(res => {
            // const roles = res.result && res.result.role
            const menuTree = res.responseObject && res.responseObject.menuTree
            store.dispatch('GenerateRoutes', { menuTree }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求失败，请联系管理员'
            })
            // store.dispatch('Logout').then(() => { // /user/login
            //   Vue.ls.remove(ACCESS_TOKEN)
            //   openid().then(res => {
            //     console.log(res)
            //     window.location.href = res
            //   })
            //   // next({ path: '/user/login', query: { redirect: to.fullPath } })
            //   // next({ path: '/user/login', query: { redirect: to.fullPath } })
            // })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else { // /user/login  empower
      // next({ path: '/user/login', query: { redirect: to.fullPath } })
      // next({ path: '/logout' })
      openid({flag: 0}).then(res => {
        window.location.href = res
      })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = elVal instanceof String && [elVal] || elVal
    roles.permissions.forEach(p => {
      if (!permissionId.includes(p.permissionId)) {
        return
      }
      if (p.actionList && !p.actionList.includes(actionName)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

export {
  action
}
