import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/mainPlan/fuzzySearch', //模糊查询
  queryOne: '/mainPlan/queryOne',//查询所有数据
  source: '/mainPlan/source', //查询设备来源
  approve: '/mainPlan/approve', //审批同意
  reject: '/mainPlan/reject', //审批拒绝
  save: '/mainPlan/save',  //保存
  del: '/mainPlan/del', //删除
  update: '/mainPlan/update',//编辑提交更新
  retrieve: '/mainPlan/back', //取回
  submit: '/mainPlan/submit', //提交
}

export default api
export function fuzzySearch (parameter) {//模糊查询
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
