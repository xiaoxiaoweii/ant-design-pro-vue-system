import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/tokeStock/fuzzySearch', //模糊查询
  queryOne: '/tokeStock/queryOne',//查询所有数据
  selectCondInfo: '/selectCondInfo',//查询分包商
  source: '/tokeStock/source', //查询设备来源
  approve: '/tokeStock/approve', //审批同意
  reject: '/tokeStock/reject', //审批拒绝
  queryledger:'/tokeStock/queryledger', //根据设备名称查询
  save: '/tokeStock/save',  //保存
  del: '/tokeStock/del', //删除
  update: '/tokeStock/update',//编辑提交更新
  retrieve: '/tokeStock/back', //取回
  submit: '/tokeStock/submit', //提交
}

export default api
export function getInventoryList (parameter) {//模糊查询
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
export function saveInventory (data) { //保存
  return axios({
    url: api.save,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function batchDeleteInventory (data, parameter) {//删除
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function updateInventory (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function retrieveInventory (data, parameter) {
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function submitInventory (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleInventory (data, type, parameter) {
  switch (type) {
    case 'save':
      return saveInventory(data)
    case 'delete':
      return batchDeleteInventory(data, parameter)
    case 'update':
      return updateInventory(data)
    case 'retrieve':
      return retrieveInventory(data, parameter)
    case 'submit':
      return submitInventory(data)
    default:
      break
  }
}
