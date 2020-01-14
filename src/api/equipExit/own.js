import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  purchase: '/selfEquipOut/fuzzysearch',
  submit: '/selfEquipOut/submit ',
  edit: '/selfEquipOut/update',
  cancel: '/selfEquipOut/back',
  create: '/selfEquipOut/save',
  delete: '/selfEquipOut/delete',
  queryone: '/selfEquipOut/queryOne',
  // export: '/equipOutPlan/exportPDF '
  exportToexcel: '/selfEquipOut/exportExcel',
  exportTopdf: '/selfEquipOut/exportPDF',
  exportpdfList: '/selfEquipOut/exportPDFList',
  exportexcelList: '/selfEquipOut/exportExcelList',
  approve: '/selfEquipOut/approve',
  reject: '/selfEquipOut/reject',
  queryEquipDetail: '/selfEquipOut/queryEquipDetail',
  queryEquip: '/selfEquipOut/queryEquip'
}

export default api
export function queryEquipDetail (parameter) {
  return axios({
    url: api.queryEquipDetail,
    method: 'get',
    params: parameter
  })
}

export const formStatus = {
  saved: 10040001, // 已保存
  submitted: 10040002, // 已提交
  approval: 10040003, // 审批中
  returned: 10040004, // 已退回
  approved: 10040005 // 审批完成
}
export const formStatusArray = [
  {
    text: '已保存',
    value: '10040001'
  },
  {
    text: '已提交',
    value: '10040002'
  },
  {
    text: '审批中',
    value: '10040003'
  },
  {
    text: '已退回',
    value: '10040004'
  },
  {
    text: '审批完成',
    value: '10040005'
  }
]
export function exportToExcel (data) {
  return axios({
    url: api.exportToexcel,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exportToPdf (data) {
  return axios({
    url: api.exportTopdf,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exporttoPDFList (data) {
  return axios({
    url: api.exportpdfList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exporttoExcelList (data) {
  return axios({
    url: api.exportexcelList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

// 查询税率
export function queryTaxRate (parameter) {
  return axios({
    url: api.queryTaxRate,
    method: 'get',
    params: parameter

  })
}
export function createOwnEquipmentOut (data) {
  return axios({
    url: api.create,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateOwnEquipmentOut (data) {
  return axios({
    url: api.edit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteOwnEquipmentOut (data, parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitOwnEquipmentOut (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelOwnEquipmentOut (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getOwnEquipmentOutList (parameter) {
  return axios({
    url: api.purchase,
    method: 'get',
    params: parameter
  })
}

export function queryone (parameter) {
  return axios({
    url: api.queryone,
    method: 'post',
    params: parameter
  })
}
export function getSerialNumber (parameter) {
  return axios({
    url: api.serial_number,
    method: 'post'
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

export function queryEquip (parameter) {
  return axios({
    url: api.queryEquip,
    method: 'get',
    params: parameter
  })
}

export function handleOwnEquipmentOut (type, data, parameter) {
  console.log(data, type, parameter)
  switch (type) {
    case 'create':
      return createOwnEquipmentOut(data)
    case 'delete':
      return batchDeleteOwnEquipmentOut(data, parameter)
    case 'update':
      return updateOwnEquipmentOut(data)
    case 'retrieve':
      return getOwnEquipmentOutList(parameter)
    case 'submit':
      return submitOwnEquipmentOut(data)
    case 'cancel':
      return cancelOwnEquipmentOut(data)
    default:
      break
  }
}
