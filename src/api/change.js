import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  change: '/change/request',
  submit: '/change/requestsubmit',
  edit: '/change/one',
  cancel: '/change/cancel',
  // 审批同意
  approve: '/change/approve',
  // 审批拒绝
  refuse: '/change/reject',
  exportToexcel: '/change/exportExcel',
  exportTopdf: '/change/exportPDF',
  exportpdfList:'/change/exportPDFList',
  exportexcelList:'/change/exportExcelList'
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

export function createChange (data) {
  /**
   *
   * @api {POST} /business/change/request 1. 创建购置申请
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
    url: api.change,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateChange (data) {
  /**
   *
   * @api {POST} /business/change/request?_method=PUT 2. 修改购置申请
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
    url: `${api.change}?_method=PUT`,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDeleteChange (data, parameter) {
  /**
   *
   * @api {POST} /business/change/request?_method=DELETE 3. 批量删除购置申请单
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
    url: `${api.change}?_method=DELETE`,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitChange (data) {
  /**
   *
   * @api {POST} /business/change/requestsubmit 4. 提交购置申请单
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
    url: api.submit,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function cancelChange (data) {
  /**
   *
   * @api {POST} /business/change/cancel 4. 提交购置申请单
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

export function getChangeList (parameter) {
  /**
   *
   * @api {GET} /business/change 5. 查询购置申请列表
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
    url: api.change,
    method: 'get',
    params: parameter
  })
}

export function getDeviceList (parameter) {
  /**
   *
   * @api {GET} /business/change/detail 6. 查询购置申请单设备列表
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
   *            "purchase_request_id": 22,
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
    method: 'get',
    params: parameter
  })
}

export function exportToExcel (data) {
  /**
   *
   * @api {POST} /business/change/request/export 1. 导出数据到Excel
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
   * @api {POST} /business/change/request/export 1. 导出数据到Excel
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

export function exporttoPDFList (data) {
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
    url: api.exportpdfList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function exporttoExcelList (data) {
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
    url: api.exportexcelList,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function handleChange (data, type, parameter) {
  switch (type) {
    case 'create':
      return createChange(data)
    case 'delete':
      return batchDeleteChange(data, parameter)
    case 'update':
      return updateChange(data)
    case 'retrieve':
      return getChangeList(data, parameter)
    case 'submit':
      return submitChange(data)
    case 'cancel':
      return cancelChange(data)
    default:
      break
  }
}
