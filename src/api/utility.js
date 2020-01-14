import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  menuEnum: '/flow/organ'
}

export default api

export function editUtilityUserAndStation (data) {
  return axios({
    url: api.menuEnum,
    method: 'post',
    data: jsonToFormData(data),
    params: { _method: 'put' }
  })
}

export function postUtilityUserAndStation (data) {
  return axios({
    url: api.menuEnum,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getUtilityUserAndStation (parameter) {
  return axios({
    url: api.menuEnum,
    method: 'get',
    params: parameter
  })
}

export function batchDelUserOrStation (data) {
  return axios({
    url: api.menuEnum,
    method: 'post',
    data: jsonToFormData(data),
    params: { _method: 'delete' }
  })
}
