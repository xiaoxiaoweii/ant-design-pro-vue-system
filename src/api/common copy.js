import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  export: '/equip/export',
  upload: '/business/file/upload',
  download: '/file/download',
  delAttachment: '/file/delfile',
  file: '/file/queryfile',
  hr: (path) => `/hr/${path}`
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
  purchase: '001', // 购置申请单模块
  transgfer: '002', // 调拨申请单模块
  retirement: '003', // 报废申请单模块
  SettlementLeased:'E005',//租赁设备结算
  vehicleCost:'E006',//路用车模块
  equipRepair:'E007',//设备维修结算
  externalPayment:'E010',//对外付款申请
  monthlyCapital:'E011'//月度资金计划
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
export const formStatusArray = [
  {
    text: '已保存',
    value: '已保存'
  },
  {
    text: '已提交',
    value: '已提交'
  },
  {
    text: '审批中',
    value: '审批中'
  },
  {
    text: '已退回',
    value: '已退回'
  },
  {
    text: '审批完成',
    value: '审批完成'
  }
]

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
