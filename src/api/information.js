import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  find: '/infos',
  findOne: '/info',
  transferinfo: '/transferinfo',
  exportToexcel: '/infos/exportExcel',
  exportTopdf: '/infos/exportPDF'
}

export default api

export const infoLabel = {
  contract_sign_date: '合同签订日期',
  manufacturing_code: '出厂编号',
  financial_code: '资产编号',
  months_left: '剩余折旧月份',
  operator_certificate_id: '操作人证件号',
  spec: '规格',
  work_place: '使用单位(工作地点)',
  contracted_value: '购置合同金额',
  unused_date: '当前闲置的时间',
  contract_code: '合同编号',
  this_year_depreciation: '本年计提折旧(元)',
  net_value: '净值',
  depreciation_ratio_per_month: '每月折旧率',
  org_use: '使用单位',
  model: '型号',
  vin: '车牌VIN号',
  large_equipment: '是否大型设备',
  id: 'ID',
  org_owner: '产权单位',
  accumulated_workload: '累计完成工作量',
  equipment_name: '设备名称',
  tech_state: '技术状态',
  original_value: '设备原值',
  unused_reason: '闲置的原因',
  weight: '总重量',
  estimated_out_date: '预计退场日期',
  use_state: '目前使用状态',
  accumulated_depreciation: '累计折旧金额',
  request_code: '单据编号',
  plate_number: '设备牌照号',
  color: '颜色',
  org_manage: '管理单位',
  equipment_code: '设备编码',
  production_date: '出厂日期',
  org_use_code: '使用单位编码',
  created_at: '记录添加时间',
  remark: '报废说明',
  manufacturer: '生产厂家',
  this_month_depreciation: '本月折旧金额',
  years_depreciation: '折旧年限',
  equipment_management_code: '管理号码',
  org_owner_id: '产权单位编码',
  updated_at: '修改时间',
  engine_number: '发动机号',
  power: '功率(KW)',
  supplier_name: '供货商',
  dimension: '外型尺寸',
  org_manage_id: '管理单位编码',
  frame_number: '车架号',
  this_month_work_load: '本月完成工作量',
  special_equipment: '是否特种设备',
  operator_name: '操作人',
  request_date: '购置申请单完成日期',
  is_imported: '是否进口国产设备',
  depreciation_method: '折旧方法',
  date_recorded: '资产入账日期'
}


export function getInfoList (parameter) {
  /**
   *
   * @api {GET} /business/infos 1. 设备资产信息列表
   * @apiName 1. 设备资产信息列表
   * @apiGroup INFORMATION
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "查询成功.",
   *     "responsePageInfo": {
   *      "total": 1,
   *      "list": [
   *          {
   *              "equipment_name": "变压器",
   *              "operator_name": "张飞",
   *              "equipment_management_code": "185454699",
   *              "tech_state": "5A级",
   *              "org_manage": "工程部",
   *              "production_date": "2019-08-22",
   *              "request_date": "2019-08-26",
   *              "model": "MS-1982",
   *              "id": 1,
   *              "org_owner": "201866",
   *              "manufacturer": "南京机电公司"
   *          }
   *      ],
   *      "pageNum": 1,
   *      "pageSize": 2,
   *      "size": 1,
   *      "startRow": 1,
   *      "endRow": 1,
   *      "pages": 1,
   *      "prePage": 0,
   *      "nextPage": 0,
   *      "isFirstPage": true,
   *      "isLastPage": true,
   *      "hasPreviousPage": false,
   *      "hasNextPage": false,
   *      "navigatePages": 8,
   *      "navigatepageNums": [
   *          1
   *      ],
   *      "navigateFirstPage": 1,
   *      "navigateLastPage": 1,
   *      "lastPage": 1,
   *      "firstPage": 1
   *   },
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.find,
    method: 'get',
    params: parameter
  })
}

export function getTransferinfo (parameter) {
  /**
   *
   * @api {GET} /business/info?id=${id} 2. 设备资产信息详情
   * @apiName 2. 设备资产信息详情
   * @apiGroup INFORMATION
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "查询成功.",
   *     "responseObject": {
   *         "contract_sign_date": "2019-08-27",
   *         "manufacturing_code": "48888815",
   *         "financial_code": "2018-09-1112",
   *         "months_left": 246,
   *         "operator_certificate_id": "432211198008196635",
   *         "spec": "S11-M-500/11",
   *         "work_place": "长沙",
   *         "contracted_value": 18555.56,
   *         "unused_date": "2019-09-06",
   *         "contract_code": "2019082623",
   *         "this_year_depreciation": 1896.55,
   *         "net_value": 131.22,
   *         "depreciation_ratio_per_month": 1.60,
   *         "org_use": "188826",
   *         "model": "MS-19823",
   *         "vin": "19345",
   *         "large_equipment": "否",
   *         "id": 2,
   *         "org_owner": "201867",
   *         "accumulated_workload": 101,
   *         "equipment_name": "变压器2",
   *         "tech_state": "4A级",
   *         "original_value": 152.23,
   *         "unused_reason": "维修",
   *         "weight": 3,
   *         "estimated_out_date": "2019-10-24",
   *         "use_state": "空闲中",
   *         "accumulated_depreciation": 68.00,
   *         "request_code": "132388883",
   *         "plate_number": "苏A818U2",
   *         "color": "灰色",
   *         "org_manage": "工程部2",
   *         "equipment_code": "B121254t",
   *         "production_date": "2019-08-23",
   *         "org_use_code": "scs201813",
   *         "created_at": "2019-08-26 10:41:29",
   *         "remark": "需要维修，停用一段时间",
   *         "manufacturer": "南京机电公司2",
   *         "this_month_depreciation": 2.35,
   *         "years_depreciation": "2         ",
   *         "equipment_management_code": "1854546900",
   *         "org_owner_id": 152,
   *         "updated_at": "2019-08-26 10:41:33",
   *         "engine_number": "12mss15",
   *         "power": 10001,
   *         "supplier_name": "机电厂2",
   *         "dimension": "1.2x1.6x3.8",
   *         "org_manage_id": 1243,
   *         "frame_number": "14mt15",
   *         "this_month_work_load": 89,
   *         "special_equipment": "是",
   *         "operator_name": "启超",
   *         "request_date": "2019-08-27",
   *         "is_imported": "否",
   *         "depreciation_method": 3,
   *         "date_recorded": "2019-08-27"
   *     },
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.transferinfo,
    method: 'get',
    params: parameter
  })
}

export function getInfo (parameter) {
  /**
   *
   * @api {GET} /business/info?id=${id} 2. 设备资产信息详情
   * @apiName 2. 设备资产信息详情
   * @apiGroup INFORMATION
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "查询成功.",
   *     "responseObject": {
   *         "contract_sign_date": "2019-08-27",
   *         "manufacturing_code": "48888815",
   *         "financial_code": "2018-09-1112",
   *         "months_left": 246,
   *         "operator_certificate_id": "432211198008196635",
   *         "spec": "S11-M-500/11",
   *         "work_place": "长沙",
   *         "contracted_value": 18555.56,
   *         "unused_date": "2019-09-06",
   *         "contract_code": "2019082623",
   *         "this_year_depreciation": 1896.55,
   *         "net_value": 131.22,
   *         "depreciation_ratio_per_month": 1.60,
   *         "org_use": "188826",
   *         "model": "MS-19823",
   *         "vin": "19345",
   *         "large_equipment": "否",
   *         "id": 2,
   *         "org_owner": "201867",
   *         "accumulated_workload": 101,
   *         "equipment_name": "变压器2",
   *         "tech_state": "4A级",
   *         "original_value": 152.23,
   *         "unused_reason": "维修",
   *         "weight": 3,
   *         "estimated_out_date": "2019-10-24",
   *         "use_state": "空闲中",
   *         "accumulated_depreciation": 68.00,
   *         "request_code": "132388883",
   *         "plate_number": "苏A818U2",
   *         "color": "灰色",
   *         "org_manage": "工程部2",
   *         "equipment_code": "B121254t",
   *         "production_date": "2019-08-23",
   *         "org_use_code": "scs201813",
   *         "created_at": "2019-08-26 10:41:29",
   *         "remark": "需要维修，停用一段时间",
   *         "manufacturer": "南京机电公司2",
   *         "this_month_depreciation": 2.35,
   *         "years_depreciation": "2         ",
   *         "equipment_management_code": "1854546900",
   *         "org_owner_id": 152,
   *         "updated_at": "2019-08-26 10:41:33",
   *         "engine_number": "12mss15",
   *         "power": 10001,
   *         "supplier_name": "机电厂2",
   *         "dimension": "1.2x1.6x3.8",
   *         "org_manage_id": 1243,
   *         "frame_number": "14mt15",
   *         "this_month_work_load": 89,
   *         "special_equipment": "是",
   *         "operator_name": "启超",
   *         "request_date": "2019-08-27",
   *         "is_imported": "否",
   *         "depreciation_method": 3,
   *         "date_recorded": "2019-08-27"
   *     },
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.findOne,
    method: 'get',
    params: parameter
  })
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
    url: api.exportToexcel,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function exportToPdf (data) {
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
    url: api.exportTopdf,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
