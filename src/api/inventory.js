import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  create: '/inventory/save',
  retrieve: '/inventory/fuzzySearch',
  update: '/inventory/update',
  del: '/inventory/del',
  submit: '/inventory/distribute',
  findOne: '/inventory/one',
  cancel: '/inventory/backstatus',
  selectByDetail: '/inventory/selectByDetail',
  selectByDetailson: '/inventory/selectByDetails',
  selectById: '/inventory/selectById',
  selectByDetailId: '/inventory/selectByDetailId',
  // 查询所有合同号码
  queryAllCode: '/inventory/queryAllCode',
  // 通过合同编号查询合同信息
  queryByCode: '/inventory/queryByCode',
  exportToexcel: '/inventory/exportExcel',
  exportTopdf: '/inventory/exportPdf'
}

export default api

export function selectById (parameter) {
  return axios({
    url: api.selectById,
    method: 'get',
    params: parameter
  })
}

export function selectByDetailId (parameter) {
  return axios({
    url: api.selectByDetailId,
    method: 'get',
    params: parameter
  })
}

export function selectByDetailson (parameter) {
  return axios({
    url: api.selectByDetailson,
    method: 'get',
    params: parameter
  })
}

export function selectByDetail (parameter) {
  return axios({
    url: api.selectByDetail,
    method: 'get',
    params: parameter
  })
}

export function handleQueryApprover (data) {
  return axios({
    url: api.queryApprover,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function queryAllCode (parameter) {
  return axios({
    url: api.queryAllCode,
    method: 'get',
    params: parameter
  })
}

export function queryByCode (data) {
  return axios({
    url: api.queryByCode,
    method: 'post',
    data: jsonToFormData(data)
  })
}

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

export function createInventory (data) {
  /**
   *
   * @api {POST} /business/purchase/request 1. 创建购置申请
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
    url: api.create,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function updateInventory (data) {
  /**
   *
   * @api {POST} /business/updatedata 2. 修改购置申请
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

export function batchDeleteInventory (data, parameter) {
  /**
   *
   * @api {POST} /business/purchase/request?_method=DELETE 3. 批量删除购置申请单
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

export function submitInventory (data) {
  /**
   *
   * @api {POST} /business/purchase/requestsubmit 4. 提交购置申请单
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

export function cancelInventory (data) {
  /**
   *
   * @api {POST} /business/purchase/cancel 4. 提交购置申请单
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

export function getInventoryList (parameter) {
  /**
   *
   * @api {GET} /business/purchase 5. 查询资产验收单列表
   * @apiName 5. 查询资产验收单列表
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
    url: api.retrieve,
    method: 'get',
    params: parameter
  })
}

export function getInventory (parameter) {
  /**
   *
   * @api {GET} /business/purchase/detail 6. 查询购置申请单设备列表
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
    url: api.findOne,
    method: 'get',
    params: parameter
    // data: jsonToFormData(data)
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

export function handleInventory (data, type, parameter) {
  switch (type) {
    case 'create':
      return createInventory(data)
    case 'delete':
      return batchDeleteInventory(data, parameter)
    case 'update':
      return updateInventory(data)
    case 'retrieve':
      return getInventoryList(data, parameter)
    case 'submit':
      return submitInventory(data)
    case 'cancel':
      return cancelInventory(data)
    case 'findOne':
      return getInventory(data)
    default:
      break
  }
}
