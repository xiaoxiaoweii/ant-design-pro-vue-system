import Vue from 'vue'
import { login, login1, getInfo } from '@/api/login'
import { logout } from '@/api/common'
import { getQueryTree } from '@/api/userMenu'
import { ACCESS_TOKEN, DEFAULT_UID } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    trees: [],
    info: null,
    uid: '',
    first_key: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_TREE: (state, trees) => {
      state.trees = trees
    },
    SET_FIRST_KEY: (state, key) => {
      state.first_key = key
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.status === '0') {
            const result = response.responseObject
            Vue.ls.set(ACCESS_TOKEN, result.businessToken || 'token', result.exptime ? result.exptime * 1000 : 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(DEFAULT_UID, result.id, result.exptime ? result.exptime * 1000 : 7 * 24 * 60 * 60 * 1000)
            Vue.ls.remove('scope_code')
            commit('SET_TOKEN', result.businessToken || 'token')
            commit('SET_UID', result.id)
            // commit('SET_INFO', result)
            commit('SET_TREE', result.tree)
            // commit('SET_AVATAR', result.avatar || '/avatar2.jpg')
            // commit('SET_NAME', { name: result.name, welcome: welcome() })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    Login1 ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login1(userInfo).then(response => {
          const result = response.responseObject
          Vue.ls.set(ACCESS_TOKEN, result.businessToken || 'token', result.exptime ? result.exptime * 1000 : 7 * 24 * 60 * 60 * 1000)
          Vue.ls.set(DEFAULT_UID, result.id, result.exptime ? result.exptime * 1000 : 7 * 24 * 60 * 60 * 1000)
          Vue.ls.remove('scope_code')
          commit('SET_TOKEN', result.businessToken || 'token')
          commit('SET_UID', result.id)
          // commit('SET_INFO', result)
          commit('SET_TREE', result.tree)
          // commit('SET_AVATAR', result.avatar || '/avatar2.jpg')
          // commit('SET_NAME', { name: result.name, welcome: welcome() })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getInfo(data).then(response => {
          if (response.status === '0') {
            const result = response.responseObject

            // if (result.role && result.role.permissions.length > 0) {
            //   const role = result.role
            //   role.permissions = result.role.permissions
            //   role.permissions.map(per => {
            //     if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            //       const action = per.actionEntitySet.map(action => { return action.action })
            //       per.actionList = action
            //     }
            //   })
            //   role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            //   commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
            commit('SET_FIRST_KEY', result.currentScopeCode)
            // } else {
            //   reject(new Error('getInfo: roles must be a non-null array !'))
            // }

            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar || '/avatar2.jpg')
          } else {
            Vue.ls.remove(ACCESS_TOKEN)
          }

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取组织权限树
    GetQueryTree ({ commit }) {
      return new Promise((resolve, reject) => {
        getQueryTree().then(response => {
          commit('SET_TREE', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        // commit('SET_TOKEN', '')
        // commit('SET_UID', '')
        // commit('SET_ROLES', [])
        // commit('SET_INFO', null)

        logout(state.token).then(res => {

          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          Vue.ls.remove(ACCESS_TOKEN)
          next({ path: '/logout' })
        })
      })
    }

  }
}

export default user
