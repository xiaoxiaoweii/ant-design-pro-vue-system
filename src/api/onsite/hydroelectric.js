import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/waterElectricity/fuzzySearch',//查询水电表
  wattMeterOrElectricity: '/waterElectricity/wattMeterOrElectricity',//根据电费或者水费查询
  queryOne: '/waterElectricity/queryOne',//根据id查询所有
  approve: '/waterElectricity/approve', //审批同意
  reject: '/waterElectricity/reject', //审批拒绝
  save: '/waterElectricity/save', //保存
  update: '/waterElectricity/update', //更新
  delete: '/waterElectricity/del',//删除
  retrieve: '/waterElectricity/back',//取回
  submit: '/waterElectricity/submit', //提交
}

export default api

export function fuzzySearch (parameter) {
  return axios({
    url: api.fuzzySearch,
    method: 'get',
    params: parameter
  })
}
export function wattMeterOrElectricity (parameter) {
  return axios({
    url: api.wattMeterOrElectricity,
    method: 'get',
    params: parameter
  })
}
export function queryOne (parameter) {
  return axios({
    url: api.queryOne,
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


export function saveHydroelectric (data) {
  return axios({
    url: api.save,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateHydroelectric (data) {
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function deleteHydroelectric (data, parameter) {
  return axios({
    url: api.delete,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function retrieveHydroelectricList (data, parameter) {
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function submitHydroelectric (data) {
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleHydroelectric (data, type, parameter) {
  switch (type) {
    case 'save':
      return saveHydroelectric(data)
    case 'delete':
      return deleteHydroelectric(data, parameter)
    case 'update':
      return updateHydroelectric(data)
    case 'retrieve':
      return retrieveHydroelectricList(data, parameter)
    case 'submit':
      return submitHydroelectric(data)
    default:
      break
  }
}
