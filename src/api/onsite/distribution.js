import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/materCharge/fuzzySearch', //模糊查询
  queryOne: '/materCharge/queryOne',//查询所有数据
  selectCondInfo: '/selectCondInfo',//查询分包商
  queryDeliveryNumber: '/materCharge/queryDeliveryNumber',//查询点验单
  source: '/materCharge/source', //查询设备来源
  approve: '/materCharge/approve', //审批同意
  reject: '/materCharge/reject', //审批拒绝
  queryledger:'/materCharge/queryledger', //根据设备名称查询
  save: '/materCharge/save',  //保存
  del: '/materCharge/del', //删除
  update: '/materCharge/update',//编辑提交更新
  retrieve: '/materCharge/back', //取回
  submit: '/materCharge/submit', //提交
}

export default api
export function getDistributionList (parameter) {//模糊查询
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
export function queryDeliveryNumber (parameter) {//查询点验单
  return axios({
    url: api.queryDeliveryNumber,
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
export function saveDistribution (data) { //保存
  return axios({
    url: api.save,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function batchDeleteDistribution (data, parameter) {//删除
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function updateDistribution (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function retrieveDistribution (data, parameter) {
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function submitDistribution (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleDistribution (data, type, parameter) {
  switch (type) {
    case 'save':
      return saveDistribution(data)
    case 'delete':
      return batchDeleteDistribution(data, parameter)
    case 'update':
      return updateDistribution(data)
    case 'retrieve':
      return retrieveDistribution(data, parameter)
    case 'submit':
      return submitDistribution(data)
    default:
      break
  }
}
