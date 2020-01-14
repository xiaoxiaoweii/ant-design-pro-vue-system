import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/equipRunRecord/fuzzySearch', //模糊查询
  queryOne: '/equipRunRecord/queryOne',//查询所有数据
  selectCondInfo: '/selectCondInfo',//查询分包商
  source: '/equipRunRecord/source', //查询设备来源
  approve: '/equipRunRecord/approve', //审批同意
  reject: '/equipRunRecord/reject', //审批拒绝
  queryledger:'/equipRunRecord/queryledger', //根据设备名称查询
  save: '/equipRunRecord/save',  //保存
  del: '/equipRunRecord/del', //删除
  update: '/equipRunRecord/update',//编辑提交更新
  retrieve: '/equipRunRecord/back', //取回
  submit: '/equipRunRecord/submit', //提交
}

export default api
export function getOperationList (parameter) {//模糊查询
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
export function saveOperation (data) { //保存
  return axios({
    url: api.save,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function batchDeleteOperation (data, parameter) {//删除
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function updateOperation (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function retrieveOperation (data, parameter) {
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function submitOperation (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleOperation (data, type, parameter) {
  switch (type) {
    case 'save':
      return saveOperation(data)
    case 'delete':
      return batchDeleteOperation(data, parameter)
    case 'update':
      return updateOperation(data)
    case 'retrieve':
      return retrieveOperation(data, parameter)
    case 'submit':
      return submitOperation(data)
    default:
      break
  }
}
