import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import store from '@/store'

Vue.use(Router)

const createRouter = () =>
  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

export function resetRouter (data, vue) {
  store.dispatch('GenerateRoutes', data).then(() => {
    const newRouter = createRouter()
    newRouter.addRoutes(store.getters.addRouters)
    router.matcher = newRouter.matcher
    // router.push({ name: '404' })
    vue.$root.$emit('global::evt.updateMenu')
  })
}

export default router
