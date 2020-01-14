import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzysearch: '/equipOutPlan/fuzzysearch',
  submit: '/equipOutPlan/submit ',
  edit: '/equipOutPlan/update',
  cancel: '/equipOutPlan/back',
  create: '/equipOutPlan/save',
  delete: '/equipOutPlan/delete',
  queryone: '/equipOutPlan/queryOne',
  // export: '/equipOutPlan/exportPDF '
  exportToexcel: '/equipOutPlan/exportExcel',
  exportTopdf: '/equipOutPlan/exportPDF',
  exportpdfList: '/equipOutPlan/exportPDFList',
  exportexcelList: '/equipOutPlan/exportExcelList',
  approve: '/equipOutPlan/approve',
  reject: '/equipOutPlan/reject',
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

/**
 * 导出Excel
 * @param {Object} data 
 */
export function exportToExcel (data) {
  return axios({
    url: api.exportToexcel,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

/**
 * 导出Pdf
 * @param {Object} data 
 */
export function exportToPdf (data) {
  return axios({
    url: api.exportTopdf,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

/**
 * 列表数据导出Pdf
 * @param {Object} data 
 */
export function exporttoPDFList (data) {

  return axios({
    url: api.exportpdfList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

/**
 * 列表数据导出Excel
 * @param {Object} data 
 */
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

/**
 * 创建退场计划单
 * @param {Object} data 
 */
export function createEquipOutPlan (data) {
  return axios({
    url: api.create,
    method: 'post',
    data: jsonToFormData(data)
  })
}

/**
 * 更新退场计划单
 * @param {Obejct} data 
 */
export function updateEquipOutPlan (data) {
  return axios({
    url: api.edit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

/**
 * 批量删除退场计划
 * @param {Obejct} data 
 */
export function batchDeleteEquipOutPlan (data, parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

/**
 * 提交退场计划
 * @param {Obejct} data 
 */
export function submitEquipOutPlan (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

/**
 * 取消退场计划
 * @param {Obejct} data 
 */
export function cancelEquipOutPlan (data) {
  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

/**
 * 查询设备退场计划列表
 * @param {Object} parameter 
 */
export function getEquipOutPlanList (parameter) {
  return axios({
    url: api.fuzzysearch,
    method: 'get',
    params: parameter
  })
}

/**
 * 查询单条退场计划记录
 * @param {Obejct} data 
 */
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

export function handleEquipOutPlan (type, data, parameter) {
  console.log(data, type, parameter)
  switch (type) {
    case 'create':
      return createEquipOutPlan(data)
    case 'delete':
      return batchDeleteEquipOutPlan(data, parameter)
    case 'update':
      return updateEquipOutPlan(data)
    case 'retrieve':
      return getEquipOutPlanList(parameter)
    case 'submit':
      return submitEquipOutPlan(data)
    case 'cancel':
      return cancelEquipOutPlan(data)
    default:
      break
  }
}
