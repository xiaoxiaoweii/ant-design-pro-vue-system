import { axios } from '@/utils/request'

const api = {
  menu: '/user/dynamic-menu'
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
