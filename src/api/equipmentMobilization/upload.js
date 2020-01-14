import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  export: '/disassemble/export',
  upload: '/business/file/upload',
  download: '/file/download',
  delAttachment: '/file/delfile',
  file: '/file/queryfile',
  // 查询所有设备类型
  queryAllEquipment: '/quote/queryAllEquipment',
  // 根据设备类型查询设备或者子设备类型
  queryByEquipment: '/quote/queryByEquipment',
  // 材料类别
  queryAllCategory: '/quote/queryAllCategory',
  // 根据材料类别查询子类别
  queryByCategory: '/quote/queryByCategory',
  // 合同引入
  queryAllContract: '/quote/queryAllContract',
  // 查询hr岗位
  queryAllName: '/stationtree',
  // 根据hr岗位id查询人员
  queryByName: '/users'

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

export function queryAllEquipment (parameter) {
  return axios({
    url: api.queryAllEquipment,
    method: 'get',
    params: parameter
  })
}
export function queryByEquipment (parameter) {
  return axios({
    url: api.queryByEquipment,
    method: 'get',
    params: parameter
  })
}
export function queryAllCategory (parameter) {
  return axios({
    url: api.queryAllCategory,
    method: 'get',
    params: parameter
  })
}
export function queryByCategory (parameter) {
  return axios({
    url: api.queryByCategory,
    method: 'get',
    params: parameter
  })
}
export function queryAllContract (parameter) {
  return axios({
    url: api.queryAllContract,
    method: 'get',
    params: parameter
  })
}
export function queryAllName (parameter) {
  return axios({
    url: api.queryAllName,
    method: 'get',
    params: parameter
  })
}
export function queryByName (parameter) {
  return axios({
    url: api.queryByName,
    method: 'get',
    params: parameter
  })
}
