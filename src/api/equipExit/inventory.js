import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  rent: '/materialOut/fuzzysearch',
  submit: '/materialOut/submit ',
  edit: '/materialOut/update',
  cancel: '/materialOut/back',
  create: '/materialOut/save',
  delete: '/materialOut/delete',
  queryone: '/materialOut/queryOne',
  queryTaxRate: '/materialOut/queryTaxRate',
  export: '/materialOut/export',
  serial_number: '/material/create',
  approve: '/materialOut/approve',
  reject: '/materialOut/reject',
  queryEquip: '/equipOutPlan/queryEquip'
}

export default api

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
    url: api.export,
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
export function createMaterialOutInventory (data) {
  return axios({
    url: api.create,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateMaterialOutInventory (data) {

  return axios({
    url: api.edit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteMaterialOutInventory (data, parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitMaterialOutInventory (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelMaterialOutInventory (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getMaterialOutInventoryList (parameter) {
  return axios({
    url: api.rent,
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

export function handleMaterialOutInventory (type, data, parameter) {
  switch (type) {
    case 'create':
      return createMaterialOutInventory(data)
    case 'delete':
      return batchDeleteMaterialOutInventory(data, parameter)
    case 'update':
      return updateMaterialOutInventory(data)
    case 'retrieve':
      return getMaterialOutInventoryList(parameter)
    case 'submit':
      return submitMaterialOutInventory(data)
    case 'cancel':
      return cancelMaterialOutInventory(data)
    default:
      break
  }
}
