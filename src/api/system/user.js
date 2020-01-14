import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  // menu: '/authority/queryMenu'
  menu: '/functionMenu/menuTreeInfo',
  multiMenuTreeInfo: '/functionMenu/multiMenuTreeInfo'
}

export default api

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: api.menu,
    method: 'get'
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
