import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  depreciationFixed: '/depreciation/infos',
  edit: '/depreciation/one',

  // depreciationFixed: '/depreciationFixed/query',
  submit: '/depreciationFixed/save',
  // edit: '/depreciationFixed/selectById',
  del: '/depreciationFixed/del',
  cancel: '/depreciationFixed/back',
  commit: '/depreciationFixed/submit',
  update: '/depreciationFixed/update',
  // schedule: '/depreciationFixed/schedule',
  // purchase: '/depreciationFixed/purchase',
  // materialType: '/depreciationFixed/materialType',
  exportPdf: '/depreciationFixed/exportPDF',
  export: '/depreciationFixed/export'
}

export default api
export function createDepreciationFixed (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateDepreciationFixed (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteDepreciationFixed (data, parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitDepreciationFixed (data) {
  return axios({
    url: api.commit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelDepreciationFixed (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getDepreciationFixedList (parameter) {
  return axios({
    url: api.depreciationFixed,
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
    // data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function exportToPdf (data) {
  return axios({
    url: api.exportPdf,
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

export function handleDepreciationFixed (data, type, parameter) {
  switch (type) {
    case 'create':
      return createDepreciationFixed(data)
    case 'delete':
      return batchDeleteDepreciationFixed(data, parameter)
    case 'update':
      return updateDepreciationFixed(data)
    case 'retrieve':
      return getDepreciationFixedList(data, parameter)
    case 'submit':
      return submitDepreciationFixed(data)
    case 'cancel':
      return cancelDepreciationFixed(data)
    default:
      break
  }
}
