import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  export: '/disassemble/export',
  upload: '/business/file/upload',
  download: '/file/download',
  delAttachment: '/file/delfile',
  file: '/file/queryfile',
  single: '/dictionary/single',//查询数据字典
  //查询工程名称
  selectByProject:'/selectByProject',
  //查询设备台账
  selectLedger: '/mainPlan/selectLedger', 

  queryEquip: '/ledger/queryEquip', 
  // 导出pdf
  exportPDF: '/checkEquip/exportPDF',
  // 导出pdf列表
  exportPDFList: '/checkEquip/exportPDFList',
  // 导出excel
  exportExcel: '/checkEquip/exportExcel',
  // 导出excel列表
  exportExcelList: '/checkEquip/exportExcelList',

}

export default api

export const uploadUrl = api.upload

export const formStatus = {
  saved: 10040001, // 已保存
  submitted: 10040002, // 已提交
  approval: 10040003, // 审批中
  returned: 10040004, // 已退回
  approved: 10040005 // 审批完成
}

export const modules = {
  operation: 'O001', // 设备运转记录
  hydroelectric: 'O002', // 水电抄表
  maintenanceRecord: 'O003', // 设备维修记录
  invoiceSheet: 'O004', // 发料单
  distribution: 'O005', // 列销管理
  inventory:'O006',  //设备盘点单
  maintenancePlan:'O007',//维修保养计划

}

export function querySingle (parameter) {
  return axios({
    url: api.single,
    method: 'get',
    params: parameter

  })
}
export function selectByProject(parameter) {
  return axios({
    url: api.selectByProject,
    method: 'get',
    params: parameter
  })
}
export function selectLedger (parameter) {
  return axios({
    url: api.selectLedger,
    method: 'get',
    params: parameter
  })
}
export function queryEquip (parameter) {
  return axios({
    url: api.queryEquip,
    method: 'get',
    params: parameter
  })
}
export function exportPDF (data) {
  return axios({
    url: api.exportPDF,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exportPDFList (data) {
  return axios({
    url: api.exportPDFList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exportExcel (data) {
  return axios({
    url: api.exportExcel,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exportExcelList (data) {
  return axios({
    url: api.exportExcelList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
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

export function getAttachments (data) {
  return axios({
    url: api.file,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function downloadAttachment (data) {
  return axios({
    url: api.download,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function delAttachment (data) {
  return axios({
    url: api.delAttachment,
    method: 'post',
    data: jsonToFormData(data)
  })
}