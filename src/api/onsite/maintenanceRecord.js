import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  fuzzySearch: '/equipMain/fuzzySearch', //查询维修保养记录(包括模糊查询)
  contractsSearchById: '/contract/fuzzySearchById', //查询合同
  selectRecord: '/equipMain/selectRecord', //查询维修保养记录(包括模糊查询)
  save:'/equipMain/save', //设备维修记录保存
  del:'/equipMain/del', //设备维修记录删除
  update:'/equipMain/update', //设备维修记录更新
  submit:'/equipMain/submit', //设备维修记录提交
  retrieve:'/equipMain/back', //设备维修记录取回
  queryOne:'/equipMain/queryOne', //根据id 查询出所有的信息
  approve:'/equipMain/approve', //审批同意
  reject:'/equipMain/reject', //审批拒绝
}
export default api

export function fuzzySearch (parameter) {
  return axios({
    url: api.fuzzySearch,
    method: 'get',
    params: parameter
  })
}
export function contractsSearchById (parameter) {
  return axios({
    url: api.contractsSearchById,
    method: 'get',
    params: parameter
  })
}
export function selectRecord (parameter) {
  return axios({
    url: api.selectRecord,
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

export function saveMaintenanceRecord (data) { //保存
  return axios({
    url: api.save,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function batchDeleteMaintenanceRecord (data, parameter) { //删除
  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function updateMaintenanceRecord (data, parameter) { //编辑更新
  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function submitMaintenanceRecord (data, parameter) { //提交
  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
export function getMaintenanceRecordList (data, parameter) { //取回
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}
//选择
export function handleMaintenanceRecord (data, type, parameter) {
  switch (type) {
    case 'save':
      return saveMaintenanceRecord(data)
    case 'delete':
      return batchDeleteMaintenanceRecord(data, parameter)
    case 'update':
      return updateMaintenanceRecord(data)
    case 'retrieve':
      return getMaintenanceRecordList(data, parameter)
    case 'submit':
      return submitMaintenanceRecord(data)
    default:
      break
  }
}