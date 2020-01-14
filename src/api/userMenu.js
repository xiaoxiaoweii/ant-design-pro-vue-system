import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  queryTree: '/authority/queryTree',
  queryMenu: '/authority/queryMenu',
  queryButton: '/queryButton'
}

export default api

export function getQueryTree () {
  return axios({
    url: api.queryTree,
    method: 'get'
  })
}

export function handleQueryMenu (data) {
  return axios({
    url: api.queryMenu,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleQueryButton (data) {
  return axios({
    url: api.queryButton,
    method: 'post',
    data: jsonToFormData(data)
  })
}
