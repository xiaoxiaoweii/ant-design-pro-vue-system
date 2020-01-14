import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  vehicleCost: '/monthlyCapital/query',
  submit: '/monthlyCapital/save',
  edit: '/monthlyCapital/selectById',
  del: '/monthlyCapital/del',
  cancel: '/monthlyCapital/back',
  commit: '/monthlyCapital/submit',
  update: '/monthlyCapital/update',
  export: '/monthlyCapital/export',
  exportPDF:'/monthlyCapital/exportPDF'
}

export default api
export function createVehicleCost (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateVehicleCost (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteVehicleCost (data, parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitVehicleCost (data) {
  return axios({
    url: api.commit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelVehicleCost (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getVehicleCostList (parameter) {
  return axios({
    url: api.vehicleCost,
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

export function exportToPDF (data){
  return axios({
    url:api.exportPDF,
    method:'post',
    data:jsonToFormData(data),
    responseType:'blob'
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

export function handleMonthlyCapital (data, type, parameter) {
  switch (type) {
    case 'create':
      return createVehicleCost(data)
    case 'delete':
      return batchDeleteVehicleCost(data, parameter)
    case 'update':
      return updateVehicleCost(data)
    case 'retrieve':
      return getVehicleCostList(data, parameter)
    case 'submit':
      return submitVehicleCost(data)
    case 'cancel':
      return cancelVehicleCost(data)
    default:
      break
  }
}
