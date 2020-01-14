import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  create: '/retirement/save',
  delete: '/retirement/del',
  update: '/retirement/update',
  retrieve: '/retirement/fuzzysearch',
  detail: '/retirement/queryOne',
  submit: '/retirement/submit',
  revoke: '/retirement/back',
  // 审批同意
  approve: '/retirement/approve',
  // 审批拒绝
  refuse: '/retirement/refuse',
  // 查询某人已办事项
  yb: '/flow/yb',
  // 查询某人待办事项
  db: '/flow/db',
  exportToexcel: '/retirement/exportExcel',
  exportTopdf: '/retirement/exportPdf'
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

export function createRetirement (data) {
  /**
   *
   * @api {POST} /business/retirement/save 1. 创建报废申请单
   * @apiName 1. 创建报废申请单
   * @apiGroup RETIREMENT
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Object[]} details 申请单详细信息集合
   * @apiParam  {String} create_date 编制日期
   * @apiParam  {String} reason 购置理由
   * @apiParam  {String} remark 备注
   * @apiParam  {String} creator_user_id 编制人
   * @apiParam  {String} creator_user_name 编制人姓名
   * @apiParam  {String} creator_org_code 编制人单位ID
   * @apiParam  {String} creator_org_name 编制人单位名称
   * @apiParam  {String} retirement_date 设备预计报废日期
   * @apiParam  {String} equiment_number 本次报废设备总台数
   * @apiParam  {String} total_original_value 本次报废设备总原价
   * @apiParam  {String} total_net_value 本次报废设备总净值
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     details : [],
   *     create_date : '2019-07-30',
   *     reason : '原因',
   *     remark : '备注',
   *     creator_user_id : 'id123',
   *     creator_user_name : 'user1',
   *     creator_org_code: "123",
   *     creator_org_name: "123",
   *     retirement_data: "2019-09-09",
   *     equiment_number: 12,
   *     total_original_value: 123.213,
   *     total_net_value: 12.213
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

export function updateRetirement (data) {
  /**
   *
   * @api {POST} /retirement/update 2. 修改报废单
   * @apiName 2. 修改报废单
   * @apiGroup RETIREMENT
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Int} id 预计总金额, 申请单先汇总预计金额
   * @apiParam  {Object[]} details 申请单详细信息集合
   * @apiParam  {String} create_date 编制日期
   * @apiParam  {String} reason 购置理由
   * @apiParam  {String} remark 备注
   * @apiParam  {String} creator_user_id 编制人
   * @apiParam  {String} creator_user_name 编制人姓名
   * @apiParam  {String} creator_org_code 编制人单位ID
   * @apiParam  {String} creator_org_name 编制人单位名称
   * @apiParam  {String} retirement_data 设备预计报废日期
   * @apiParam  {String} equiment_number 本次报废设备总台数
   * @apiParam  {String} total_original_value 本次报废设备总原价
   * @apiParam  {String} total_net_value 本次报废设备总净值
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     details : [],
   *     create_date : '2019-07-30',
   *     reason : '原因',
   *     remark : '备注',
   *     creator_user_id : 'id123',
   *     creator_user_name : 'user1',
   *     creator_org_code: "123",
   *     creator_org_name: "123",
   *     retirement_data: "2019-09-09",
   *     equiment_number: 12,
   *     total_original_value: 123.213,
   *     total_net_value: 12.213
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

export function batchDeleteRetirement (data, parameter) {
  /**
   *
   * @api {POST} /business/retirement/del 3. 批量删除报废申请单
   * @apiName 3. 批量删除报废申请单
   * @apiGroup RETIREMENT
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Object[]} details 申请单详细信息ID集合
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
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
    url: api.delete,
    method: 'post',
    data: jsonToFormData(data),
    params: parameter
  })
}

export function submitRetirement (data) {
  /**
   *
   * @api {POST} /business/retirement/submit 4. 提交报废申请单
   * @apiName 4. 提交报废申请单
   * @apiGroup RETIREMENT
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 购置申请单ID集合
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     ids: [1, 2, 3]
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

export function revokeRetirement (data) {
  /**
   *
   * @api {POST} /business/retirement/back 4. 取回报废申请单
   * @apiName 4. 取回报废申请单
   * @apiGroup RETIREMENT
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 申请单ID集合
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id: [1, 2, 3]
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
    url: api.revoke,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getRetirementList (data) {
  /**
   *
   * @api {GET} /business/retirement/query 5. 查询报废申请列表
   * @apiName 5. 查询报废申请列表
   * @apiGroup RETIREMENT
   * @apiVersion  1.0.0
   *
   * @apiParam  {Number} pageNum 页码
   * @apiParam  {Number} pageSize 条数
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {param} Request-Example:
   * {
   *     pageNum: 1,
   *     pageSize: 10
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *    "responsePageInfo": {
   *            "total": 1,
   *            "list": [
   *                {
   *                    "creator_org_code": "11",
   *                    "creator_user_id": 11,
   *                    "created_at": "2019-08-13 10:23:05",
   *                    "remark": "vv",
   *                    "dic_enum_name": "已保存",
   *                    "create_date": "2019-08-06",
   *                    "total_net_value": 3.55,
   *                    "retirement_date": "2019-08-06",
   *                    "creator_user_name": "vv",
   *                    "total_original_value": 2.33,
   *                    "updated_at": "2019-08-13 10:25:30",
   *                    "equipment_number": 1,
   *                    "creator_org_name": "bbb",
   *                    "id": 16,
   *                    "status": 10040001
   *                }
   *            ],
   *            "pageNum": 1,
   *            "pageSize": 1,
   *            "size": 1,
   *            "startRow": 1,
   *            "endRow": 1,
   *            "pages": 1,
   *            "prePage": 0,
   *            "nextPage": 0,
   *            "isFirstPage": true,
   *            "isLastPage": true,
   *            "hasPreviousPage": false,
   *            "hasNextPage": false,
   *            "navigatePages": 8,
   *            "navigatepageNums": [
   *                1
   *            ],
   *            "navigateFirstPage": 1,
   *            "navigateLastPage": 1,
   *            "firstPage": 1,
   *            "lastPage": 1
   *        },
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.retrieve,
    method: 'post',
    data: jsonToFormData(data)
    // params: parameter
  })
}

export function getDeviceList (data) {
  /**
   *
   * @api {GET} /business/retirement/querydetail 6. 查询购置申请单设备列表
   * @apiName 6. 查询购置申请单设备列表
   * @apiGroup Retirement
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
    url: api.detail,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function exportToExcel (data) {
  /**
   *
   * @api {POST} /business/purchase/request/export 1. 导出数据到Excel
   * @apiName 1. 导出数据到Excel
   * @apiGroup Retirement
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
   * @apiGroup Retirement
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

export function handleRetirement (data, type, parameter) {
  switch (type) {
    case 'create':
      return createRetirement(data)
    case 'delete':
      return batchDeleteRetirement(data, parameter)
    case 'update':
      return updateRetirement(data)
    case 'retrieve':
      return getRetirementList(data, parameter)
    case 'submit':
      return submitRetirement(data)
    case 'revoke':
      return revokeRetirement(data)
    case 'detail':
      return getDeviceList(data)
    default:
      break
  }
}
