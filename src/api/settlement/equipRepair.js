import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  apitalMaterial: '/equipRepair/request',
  submit: '/equipRepair/save',
  edit: '/equipRepair/one',
  // del: '/equipRepair/del',
  cancel: '/equipRepair/cancel',
  commit: '/equipRepair/requestsubmit',
  update: '/equipRepair/update',
  // schedule: '/materCharge/schedule',
  // purchase: '/materCharge/purchase',
  // materialType: '/materCharge/materialType',
  export: '/equipRepair/export',
  history: '/equipRepair/history',
  ledger: '/equipRepair/maintain',
  supplier: '/equipRepair/supplier',
  amount: '/equipRepair/amount',
  approve: '/equipRepair/approve',
  reject: '/equipRepair/reject'
}

export default api

export function getAmount (parameter) {
  return axios({
    url: api.amount,
    method: 'get',
    params: parameter
  })
}

export function getSupplier (parameter) {
  return axios({
    url: api.supplier,
    method: 'get',
    params: parameter
  })
}

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

export function getLedger (parameter) {
  return axios({
    url: api.ledger,
    method: 'get',
    params: parameter
  })
}

export function getHistory (parameter) {
  return axios({
    url: api.history,
    method: 'get',
    params: parameter
  })
}

export function createApitalMaterial (data) {
  return axios({
    url: api.apitalMaterial,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateApitalMaterial (data) {
  return axios({
    url: `${api.apitalMaterial}?_method=PUT`,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteApitalMaterial (data, parameter) {
  return axios({
    url: `${api.apitalMaterial}?_method=DELETE`,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitApitalMaterial (data) {
  return axios({
    url: api.commit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelApitalMaterial (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getApitalMaterialList (parameter) {
  return axios({
    url: api.apitalMaterial,
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

// // 查税率
// export function getSchedule (parameter) {
//   return axios({
//     url: api.schedule,
//     method: 'get',
//     params: parameter
//   })
// }

// // 查采购权限
// export function getPurchase (parameter) {
//   return axios({
//     url: api.purchase,
//     method: 'get',
//     params: parameter
//   })
// }

// // 查采购权限
// export function getMaterialType (parameter) {
//   return axios({
//     url: api.materialType,
//     method: 'get',
//     params: parameter
//   })
// }

export function handleApitalMaterial (data, type, parameter) {
  switch (type) {
    case 'create':
      return createApitalMaterial(data)
    case 'delete':
      return batchDeleteApitalMaterial(data, parameter)
    case 'update':
      return updateApitalMaterial(data)
    case 'retrieve':
      return getApitalMaterialList(data, parameter)
    case 'submit':
      return submitApitalMaterial(data)
    case 'cancel':
      return cancelApitalMaterial(data)
    default:
      break
  }
}
