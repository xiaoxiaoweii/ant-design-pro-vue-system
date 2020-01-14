import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  deviceMater: '/payment/query',
  submit: '/payment/save',
  edit: '/payment/selectById',
  del: '/payment/del',
  cancel: '/payment/back',
  commit: '/payment/submit',
  update: '/payment/update',
  export: '/payment/export'
}

export default api
export function createExternalPayment (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateExternalPayment (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteExternalPayment (data, parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitExternalPayment (data) {
  return axios({
    url: api.commit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelExternalPayment (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getExternalPaymentList (parameter) {
  return axios({
    url: api.deviceMater,
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

export function exportToExcel (data) {
  return axios({
    url: api.export,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function handlePayment (data, type, parameter) {
  switch (type) {
    case 'create':
      return createExternalPayment(data)
    case 'delete':
      return batchDeleteExternalPayment(data, parameter)
    case 'update':
      return updateExternalPayment(data)
    case 'retrieve':
      return getExternalPaymentList(data, parameter)
    case 'submit':
      return submitExternalPayment(data)
    case 'cancel':
      return cancelExternalPayment(data)
    default:
      break
  }
}
