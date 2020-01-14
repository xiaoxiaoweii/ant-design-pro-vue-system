import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  export: '/disassemble/export',
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
  siteAccept: 'B001', // 验收模块
  materialCheck: 'B002', // 点验表模块
  facilityAcceptance: 'B003', // 临时模块
  InstallationAcceptance: 'B004', // 安装模块
  roadTransport: 'B005' // 路用车模块
}
export const model = {
  siteAccept: 'B001', // 验收模块
  materialCheck: 'B002', // 点验表模块
  facilityAcceptance: 'B003', // 临时模块
  InstallationAcceptance: 'B004', // 安装模块
  roadTransport: 'B005' // 路用车模块
}

// 退场模块具体CODE
export const EXIT_EQUIP_PLAN_Modules = {
  plan: 'G001', // 设备退场计划
  leaseOut: 'G002', // 租赁设备退场
  inventory: 'G003', // 退场设备材料盘点
  ownManage: 'G004', // 自有设备鉴定
  subcontractor: 'G005' // 分包商设备退场
}

export function exportToExcel (data) {
  /**
   *
   * @api {POST} /business/requirement/export 1. 导出数据到Excel
   * @apiName 1. 导出数据到Excel
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Object[]} details 数据集合
   *
   * @apiSuccess (200) {String} details 文本信息
   * @apiSuccess (200) {String} flag 状态
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
   * @api {POST} /business/file/queryfile 2. 查询附件
   * @apiName 2. 查询附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} id 表单id
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     module:004
          id_in_module:13
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
   * @api {POST} /business/requirement/upload 3. 下载附件
   * @apiName 3. 下载附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} Path 文件路径
   * @apiParam  {String} name 文件明
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
  *{
      "msg": "上传成功",
      "responseObject": {
          "path": "D:/tmp/require/20190820/",
          "name": "个人周报_刘仁军.xlsx"
      },
      "status": "0"
  *}
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "上传成功"
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
   * @api {POST} /business/file/delfile 4. 删除附件
   * @apiName 4. 删除附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} filePath 文件路径
   * @apiParam  {String} fileName 文件名
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *   filePath:"D:/tmp/require/20190820/"
      fileName"个人周报_刘仁军.xlsx"
      id:26
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "删除成功"
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
