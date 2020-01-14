import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  rent: '/rentEquipOut/fuzzysearch',
  submit: '/rentEquipOut/submit ',
  edit: '/rentEquipOut/update',
  cancel: '/rentEquipOut/back',
  create: '/rentEquipOut/save',
  delete: '/rentEquipOut/delete',
  queryone: '/rentEquipOut/queryOne',
  queryTaxRate: '/rentEquipOut/queryTaxRate',
  export: '/rentEquipOut/export',
  serial_number: '/material/create',
  approve: '/rentEquipOut/approve',
  reject: '/rentEquipOut/reject',
  queryEquip: '/rentEquipOut/queryEquip'
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
export function createRentEquipOut (data) {
  return axios({
    url: api.create,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateRentEquipOut (data) {

  return axios({
    url: api.edit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteRentEquipOut (data, parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitEquipOut (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelEquipOut (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getRentEquipOutList (parameter) {
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

export function handleRentEquipOut (type, data, parameter) {
  switch (type) {
    case 'create':
      return createRentEquipOut(data)
    case 'delete':
      return batchDeleteRentEquipOut(data, parameter)
    case 'update':
      return updateRentEquipOut(data)
    case 'retrieve':
      return getRentEquipOutList(parameter)
    case 'submit':
      return submitEquipOut(data)
    case 'cancel':
      return cancelEquipOut(data)
    default:
      break
  }
}
