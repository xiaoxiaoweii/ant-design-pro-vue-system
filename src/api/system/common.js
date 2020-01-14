import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  // export: '/purchase/request/export',
  upload: '/business/file/upload',
  download: '/file/download',
  delAttachment: '/file/delfile',
  file: '/file/queryfile',
  hr: (path) => `/hr/${path}`,
  equList: '/equList',
  allEquip: '/equipment/all?equipment_code=NULL',
  single: '/equipment/single',
  // 查询所有设备类型
  queryAllEquipment: '/quote/queryAllEquipment',
  // 模糊搜索设备类型
  fuzzysearchEquipment: '/quote/fuzzysearchEquipment',
  // 查询所有合同号码
  queryContractCode: '/contract/queryContractCode',
  // 模糊查询合同号码
  queryLikeContractCode: '/contract/queryLikeContractCode',
  // 模糊搜索合同号码
  fuzzySearchById: '/contract/fuzzySearchById',
  // 根据设备类型查询设备或者子设备类型
  queryByEquipment: '/quote/queryByEquipment',
  // 查询一个审批有几个人审了
  queryApprover: '/flow/queryApprover',
  // 获取HR树中的岗位树
  stationtree: '/stationtree',
  // 根据岗位id获取人员信息
  getUsers: '/users',
  // 调拨设备
  resource: '/transfer/resource',
  // 根据岗位id获取人员信息
  treeinfo: '/permission/treeinfo'
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

export function getTreeinfo (parameter) {
  return axios({
    url: api.treeinfo,
    method: 'get',
    params: parameter
  })
}

export function getResource (parameter) {
  return axios({
    url: api.resource,
    method: 'get',
    params: parameter
  })
}

export function fuzzySearchById (data) {
  return axios({
    url: api.fuzzySearchById,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getUsers (parameter) {
  return axios({
    url: api.getUsers,
    method: 'get',
    params: parameter
  })
}

export function queryContractCode (parameter) {
  return axios({
    url: api.queryContractCode,
    method: 'get',
    params: parameter
  })
}

export function queryLikeContractCode (data) {
  return axios({
    url: api.queryLikeContractCode,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function queryByEquipment (parameter) {
  return axios({
    url: api.queryByEquipment,
    method: 'get',
    params: parameter
  })
}

export function fuzzysearchEquipment (parameter) {
  return axios({
    url: api.fuzzysearchEquipment,
    method: 'get',
    params: parameter
  })
}

export function queryAllEquipment (parameter) {
  return axios({
    url: api.queryAllEquipment,
    method: 'get',
    params: parameter
  })
}

export function handleStationtree (parameter) {
  return axios({
    url: api.stationtree,
    method: 'get',
    parameter: parameter
  })
}

export function handleQueryApprover (data) {
  return axios({
    url: api.queryApprover,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getAllEquip (parameter) {
  return axios({
    url: api.allEquip,
    method: 'get',
    params: parameter
  })
}

export function getSingle (parameter) {
  return axios({
    url: api.single,
    method: 'get',
    params: parameter
  })
}

export const formStatusLabel = {
  10040001: '已保存',
  10040002: '已提交',
  10040003: '审批中',
  10040004: '已退回',
  10040005: '审批完成'
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

export const modules = {
  purchase: '001', // 购置申请单模块
  acceptance: '002', // 验收申请单模块
  use: '003', // 调拨申请单模块
  retirement: '004', // 报废申请单模块
  inventory: '006' // 盘点单模块
}

export function exportToExcel (data) {
  /**
   *
   * @api {POST} /business/purchase/request/export 1. 导出数据到Excel
   * @apiName 1. 导出数据到Excel
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Object[]} details 数据集合
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     details : [],
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   *  stream //文件流
   *
   */

  return axios({
    url: api.export,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function getAttachments (data) {
  /**
   *
   * @api {POST} /business/purchase/request/export 2. 查询附件
   * @apiName 2. 查询附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} id 表单id
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id : 1,
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   *  stream //文件流
   *
   */

  return axios({
    url: api.file,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function downloadAttachment (data) {
  /**
   *
   * @api {POST} /business/purchase/request/download 3. 上传附件
   * @apiName 3. 上传附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} filePath 文件路径
   * @apiParam  {String} fileName 文件明
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     filePath: "部门组织.png"
   *     fileName: "D:/tmp/retirement/20190814/"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "下传成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.download,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function delAttachment (data) {
  /**
   *
   * @api {POST} /business/purchase/request/delfile 4. 删除附件
   * @apiName 4. 删除附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} filePath 文件路径
   * @apiParam  {String} fileName 文件明
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     filePath: "部门组织.png"
   *     fileName: "D:/tmp/retirement/20190814/"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "下传成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.delAttachment,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function hr (path) {
  /**
   *
   * @api {POST} /business/hr/${path} 5. 获取人力资源系统相关信息
   * @apiName 5. 获取人力资源系统相关信息
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     path: "部门组织.png"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "查询成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.hr(path),
    method: 'get'
  })
}

export function getEquList (parameter) {
  /**
   *
   * @api {POST} /business/equList 6. 获取设备列表
   * @apiName 6. 获取设备列表
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     "eName":"盾构机",
   *     "eSpecs":"M30"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "查询成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.equList,
    method: 'get',
    params: parameter
  })
}
