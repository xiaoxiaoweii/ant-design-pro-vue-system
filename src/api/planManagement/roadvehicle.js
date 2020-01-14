import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  roadvehicle: '/vehicle/fuzzySearch',
  submit: '/vehicle/save',
  edit: '/vehicle/queryOne',
  del: '/vehicle/del',
  cancel: '/vehicle/back',
  commit: '/vehicle/submit',
  update: '/vehicle/update',
  export: '/vehicle/export',
  approve:'/vehicle/approve',
  reject:'/vehicle/reject'
}

export default api

export function handleApprove (data) {
  return axios({
    url: api.approve,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleRefuse (data) {
  return axios({
    url: api.reject,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function exportToExcel (data) {
  return axios({
    url: api.export,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function createRoadvehicle (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateRoadvehicle (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteRoadvehicle (data, parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitRoadvehicle (data) {
  return axios({
    url: api.commit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelRoadvehicle (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getRoadvehicleList (parameter) {
  return axios({
    url: api.roadvehicle,
    method: 'get',
    params: parameter
  })
}

export function getDeviceList (parameter) {
  return axios({
    url: api.edit,
    method: 'get',
    params: parameter
  })
}

export function handleRoadvehicle (data, type, parameter) {
  switch (type) {
    case 'create':
      return createRoadvehicle(data)
    case 'delete':
      return batchDeleteRoadvehicle(data, parameter)
    case 'update':
      return updateRoadvehicle(data)
    case 'retrieve':
      return getRoadvehicleList(data, parameter)
    case 'submit':
      return submitRoadvehicle(data)
    case 'cancel':
      return cancelRoadvehicle(data)
    default:
      break
  }
}
