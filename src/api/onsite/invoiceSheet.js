import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/equipMaterial/fuzzySearch', //模糊查询
  queryOne: '/equipMaterial/queryOne',//查询所有数据
  selectCondInfo: '/selectCondInfo',//查询分包商
  selectOrderSheet: '/equipMaterial/selectOrderSheet',//查询点验单
  source: '/equipMaterial/source', //查询设备来源
  approve: '/equipMaterial/approve', //审批同意
  reject: '/equipMaterial/reject', //审批拒绝
  queryledger:'/equipMaterial/queryledger', //根据设备名称查询
  save: '/equipMaterial/save',  //保存
  del: '/equipMaterial/del', //删除
  update: '/equipMaterial/update',//编辑提交更新
  retrieve: '/equipMaterial/back', //取回
  submit: '/equipMaterial/submit', //提交
}

export default api
export function getInvoiceSheetList (parameter) {//模糊查询
  return axios({
    url: api.fuzzySearch,
    method: 'get',
    params: parameter
  })
}
export function queryOne (parameter) {//查询所有数据
  return axios({
    url: api.queryOne,
    method: 'get',
    params: parameter
  })
}
export function selectCondInfo (data) { 
  return axios({
    url: api.selectCondInfo,
    method: 'post',
    data:data
  })
}
export function selectOrderSheet (parameter) {//查询点验单
  return axios({
    url: api.selectOrderSheet,
    method: 'get',
    params: parameter
  })
}
export function getSource (parameter) {//查询设备来源
  return axios({
    url: api.source,
    method: 'get',
    params: parameter
  })
}
export function approve (data) { 
  return axios({
    url: api.approve,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function reject (data) { 
  return axios({
    url: api.reject,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function queryledger (parameter) {//设备名称
  return axios({
    url: api.queryledger,
    method: 'get',
    params: parameter
  })
}
export function saveInvoiceSheet (data) { //保存
  return axios({
    url: api.save,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function batchDeleteInvoiceSheet (data, parameter) {//删除
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function updateInvoiceSheet (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function retrieveInvoiceSheet (data, parameter) {
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function submitInvoiceSheet (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleInvoiceSheet (data, type, parameter) {
  switch (type) {
    case 'save':
      return saveInvoiceSheet(data)
    case 'delete':
      return batchDeleteInvoiceSheet(data, parameter)
    case 'update':
      return updateInvoiceSheet(data)
    case 'retrieve':
      return retrieveInvoiceSheet(data, parameter)
    case 'submit':
      return submitInvoiceSheet(data)
    default:
      break
  }
}
