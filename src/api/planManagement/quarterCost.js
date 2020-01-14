import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  configuration: '/capitalDudget/fuzzySearch',
  submit: '/capitalDudget/save',
  edit: '/capitalDudget/queryOne',
  del: '/capitalDudget/del',
  cancel: '/capitalDudget/back',
  commit: '/capitalDudget/submit',
  update: '/capitalDudget/update',
  schedule: '/capitalDudget/schedule',
  feeType: '/capitalDudget/feeType',
  rentType: '/capitalDudget/rentType',
  export: '/capitalDudget/export',
  serial_number: '/capitalDudget/create',
  approve:'/capitalDudget/approve',
  refuse:'/capitalDudget/reject',
  queryByCategory:'/selectMultipleConditions'
}

export function queryByCategory (data) {
  return axios.post(api.queryByCategory,data,{
    headers:{'Content-Type':'application/json'}
  })
}

export default api
export function handleApprove (data) {
  return axios({
    url: api.approve,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function handleRefuse (data) {
  return axios({
    url: api.refuse,
    method: 'post',
    data: jsonToFormData(data)
  })
}
export function createConfiguration (data) {
  /**
   *
   * @api {POST} /business/configuration/request 1. 创建购置申请
   * @apiName 1. 创建购置申请
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} totalAmount 预计总金额, 申请单先汇总预计金额
   * @apiParam  {Object[]} details 申请单详细信息集合
   * @apiParam  {String} createDate 编制日期
   * @apiParam  {String} reason 购置理由
   * @apiParam  {String} remark 备注
   * @apiParam  {String} creatorUserId 编制人
   * @apiParam  {String} creatorUserName 编制人姓名
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     totalAmount : 35.5,
   *     details : [],
   *     createDate : '2019-07-30',
   *     reason : '原因',
   *     remark : '备注',
   *     creatorUserId : 'id123',
   *     creatorUserName : 'user1'
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     status : "0"
   * }
   *
   *
   */

  return axios({
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateConfiguration (data) {
  /**
   *
   * @api {POST} /business/configuration/request?_method=PUT 2. 修改购置申请
   * @apiName 2. 修改购置申请
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 购置申请单ID
   * @apiParam  {Number} totalAmount 预计总金额, 申请单先汇总预计金额
   * @apiParam  {Object[]} details 申请单详细信息集合
   * @apiParam  {String} createDate 编制日期
   * @apiParam  {String} reason 购置理由
   * @apiParam  {String} remark 备注
   * @apiParam  {String} creatorUserId 编制人
   * @apiParam  {String} creatorUserName 编制人姓名
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id: 'id_test',
   *     totalAmount : 35.5,
   *     details : [],
   *     createDate : '2019-07-30',
   *     reason : '原因',
   *     remark : '备注',
   *     creatorUserId : 'id123',
   *     creatorUserName : 'user1'
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     status : "0"
   * }
   *
   *
   */

  return axios({
    url: api.update,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteConfiguration (data, parameter) {
  /**
   *
   * @api {POST} /business/configuration/request?_method=DELETE 3. 批量删除购置申请单
   * @apiName 3. 批量删除购置申请单
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 购置申请单ID
   * @apiParam  {Object[]} details 申请单详细信息ID集合
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id: 'id_test',
   *     details : [1, 2]
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     status : "0"
   * }
   *
   *
   */

  return axios({
    url: api.del,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitConfiguration (data) {
  /**
   *
   * @api {POST} /business/configuration/requestsubmit 4. 提交购置申请单
   * @apiName 4. 提交购置申请单
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 购置申请单ID
   * @apiParam  {Number} status 申请单状态
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id: 'id_test',
   *     status : 0
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     status : "0"
   * }
   *
   *
   */

  return axios({
    url: api.commit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelConfiguration (data) {
  /**
   *
   * @api {POST} /business/configuration/cancel 4. 提交购置申请单
   * @apiName 4. 提交购置申请单
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 购置申请单ID
   * @apiParam  {Number} status 申请单状态
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id: 'id_test',
   *     status : 0
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     status : "0"
   * }
   *
   *
   */

  return axios({
    url: api.cancel,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getConfigurationList (parameter) {
  /**
   *
   * @api {GET} /business/configuration 5. 查询购置申请列表
   * @apiName 5. 查询购置申请列表
   * @apiGroup PURCHASE
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
   *     msg : "操作成功.",
   *     responseList: [
   *         {
   *              "id": "id123",
   *              "totalAmount": 35.5,
   *              "details": [],
   *              "createDate": '2019-07-30',
   *              "reason": "原因",
   *              "remark": "备注",
   *              "creatorUserId": "userid123",
   *              "creatorUserName": "user1",
   *         }
   *     ]
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.configuration,
    method: 'get',
    params: parameter
  })
}

export function getDeviceList (data) {
  /**
   *
   * @api {GET} /business/configuration/detail 6. 查询购置申请单设备列表
   * @apiName 6. 查询购置申请单设备列表
   * @apiGroup PURCHASE
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
   *     msg : "操作成功.",
   *     responseList: [
   *        {
   *            "estimated_price": 12.20,
   *            "amount": 24.40,
   *            "equipment_code": "w12",
   *            "order_number": 1,
   *            "created_at": "2019-08-08 14:09:30",
   *            "remark": "哈哈哈",
   *            "spec": "s7150",
   *            "configuration_request_id": 22,
   *            "catogery": "ss",
   *            "number": 2,
   *            "unit": "台",
   *            "updated_at": "2019-08-08 14:09:30",
   *            "name": "机械",
   *            "model": "amd",
   *            "id": 22,
   *            "planned_date": "2019-09-30"
   *        }
   *     ]
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.edit,
    method: 'post',
    data: jsonToFormData(data)
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
    url: api.export,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

// 查税率
export function getSchedule (parameter) {
  return axios({
    url: api.schedule,
    method: 'get',
    params: parameter
  })
}

// 计算方式
export function getFeeType (parameter) {
  return axios({
    url: api.feeType,
    method: 'get',
    params: parameter
  })
}

// 租赁方式
export function getRentType (parameter) {
  return axios({
    url: api.rentType,
    method: 'get',
    params: parameter
  })
}

export function handleQuarterCost (data, type, parameter) {
  switch (type) {
    case 'create':
      return createConfiguration(data)
    case 'delete':
      return batchDeleteConfiguration(data, parameter)
    case 'update':
      return updateConfiguration(data)
    case 'retrieve':
      return getConfigurationList(data, parameter)
    case 'submit':
      return submitConfiguration(data)
    case 'cancel':
      return cancelConfiguration(data)
    default:
      break
  }
}
