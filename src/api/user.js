import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  // menu: '/authority/queryMenu'
  menu: '/menuTree', // '/functionMenu/menuTreeInfo' '/menuTree'
  multiMenuTreeInfo: '/functionMenu/multiMenuTreeInfo',
  version: '/version ',
  logout: '/logout'
}

export default api

export const getVersion = (parameter) => {
  return axios({
    url: api.version,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = (parameter) => {
  return axios({
    url: api.menu,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取后端权限菜单信息的
 * @returns {Promise}
 */
export const getMultiMenuTree = data => {
  return axios({
    url: api.multiMenuTreeInfo,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export const getMenuList = getRouterByUser
// export const getRouterByUser = (data) => {
//   return axios({
//     url: api.menu,
//     method: 'post',
//     data: jsonToFormData(data)
//   })
// }
