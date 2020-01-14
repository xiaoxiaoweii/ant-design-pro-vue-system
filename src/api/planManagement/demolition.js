import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  purchase: '/disassemble/fuzzysearch',
  submit: '/disassemble/submit ',
  edit: '/disassemble/update',
  cancel: '/disassemble/back',
  create: '/disassemble/save',
  delete: '/disassemble/delete',
  queryone: '/disassemble/queryOne',
  queryTaxRate: '/disassemble/queryTaxRate',
  export: '/disassemble/export',
  serial_number: '/material/create',
  queryByLedger:'/disassemble/queryByLedger',
  approve:'/disassemble/approve',
  reject:'/disassemble/reject'
}

export default api

export function handleApprove (data) {
  return axios({
    url:api.approve,
    method:'post',
    data:jsonToFormData(data)
  })
}

export function handleRefuse (data) {
  return axios({
    url:api.reject,
    method:'post',
    data:jsonToFormData(data)
  })
}

export function queryByLedger(parameter) {
  return axios({
    url:api.queryByLedger,
    method:'get',
    params:parameter
  })
}

export const formStatus = {
  saved: 10040001, // 已保存
  submitted: 10040002, // 已提交
  approval: 10040003, // 审批中
  returned: 10040004, // 已退回
  approved: 10040005 // 审批完成
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
export function exportToExcel (data) {
  /**
   *
   * @api {POST} /business/disassemble/export1. 导出数据到Excel
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

// 查询税率
export function queryTaxRate (parameter) {
  return axios({
    url: api.queryTaxRate,
    method: 'get',
    params: parameter

  })
}
export function createRequire (data) {
  /**
   *
   * @api {POST} /business/disassemble/save 1. 创建设备安拆申请表
   * @apiName 1. 创建设备安拆申请
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number}  creator_org_id  编制单位id
   * @apiParam  {Object[]} details 配件采购详细信息集合
   * @apiParam  {date} create_date 编制日期
   * @apiParam  {String} remark 备注
   * @apiParam  {number} creator_user_id 编制人id
   * @apiParam  {String} creator_user_name 编制人姓名
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "保存成功.",
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

export function updatePurchase (data) {
  /**
   *
   * @api {POST} /business/disassemble/update  2. 修改设备安拆
   * @apiName 2. 修改设备安拆
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *@apiParam  {Number}  creator_org_id  编制单位id
   * @apiParam  {Object[]} details 需求计划详细信息集合
   * @apiParam  {date} create_date 编制日期
   * @apiParam  {String}  equipment_name 设备名称
   * @apiParam  {String} remark 备注
   * @apiParam  {number} creator_user_id 编制人id
   * @apiParam  {String} creator_user_name 编制人姓名
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "修改成功.",
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

export function batchDeletePurchase (data, parameter) {
  /**
   *
   * @api {POST} /business/disassemble/delete  3. 批量删除设备安拆
   * @apiName 3. 批量删除设备安拆
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 设备安拆ID
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
   *     msg : "删除成功.",
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

export function submitRequire (data) {
  /**
   *
   * @api {POST} /business/disassemble/submit  4. 提交设备安拆申请表
   * @apiName 4. 提交设备安拆计划表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 设备安拆申请ID
   * @apiParam  {Number}  flag 设备安拆申请状态
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     flag = 0
        ids”：["34","24"]
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "提交成功.",
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

export function cancelPurchase (data) {
  /**
   *
   * @api {POST} /business/disassemble/back  4. 提交设备安拆申请表
   * @apiName 4. 提交设备安拆申请表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 设备安拆申请表ID
   * @apiParam  {Number} flag 设备安拆申请表状态
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     ids:["34","24"],
   *     flag : 0
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "msg": "回退成功",
        "status": "0"
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

export function getPurchaseList (parameter) {
  /**
   *
   * @api {GET} /business/disassemble/fuzzysearch   5. 查询设备安拆申请表
   * @apiName 5. 查询设备安拆申请表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   *】
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * "msg": "查询成功",
    "responsePageInfo": {
        "total": 2,
        "list": [
            {
                "creator_user_id": 1,
                "created_at": "2019-08-23 14:26:02",
                "serial_number": "f4fe4619-d901-4bbd-aba8-737de02f37bb",
                "remark": "123",
                "creator_org_id": 1,
                "dic_enum_name": "已保存",
                "creator_user_name": "w",
                "updated_at": "2019-08-23 14:26:02",
                "sum_with_tax": 10.11,
                "creator_org_name": "qw",
                "id": 16,
                "create_date": "2019-08-22",
                "status": 10040001
            }
        ],
        "pageNum": 1,
        "pageSize": 1,
        "size": 1,
        "startRow": 1,
        "endRow": 1,
        "pages": 2,
        "prePage": 0,
        "nextPage": 2,
        "isFirstPage": true,
        "isLastPage": false,
        "hasPreviousPage": false,
        "hasNextPage": true,
        "navigatePages": 8,
        "navigatepageNums": [
            1,
            2
        ],
        "navigateFirstPage": 1,
        "navigateLastPage": 2,
        "firstPage": 1,
        "lastPage": 2
    },
    "status": "0"
   *
   */
  return axios({
    url: api.purchase,
    method: 'get',
    params: parameter
  })
}

export function queryone (parameter) {
  /**
   *
   * @api {GET} business/disassemble/queryOne  6. 查询设备安拆申请所有信息
   * @apiName 6. 查询设备安拆申请所有信息
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} id  查询ID
   *
   * @apiSuccessExample {json} Success-Response:
   *{
    "msg": "查询成功",
    "responseObject": {
        "creator_user_id": 1,
        "created_at": "2019-08-23 14:24:41",
        "serial_number": "e0c7de09-021d-4637-ae23-e60518c446d1",
        "remark": "123",
        "creator_org_id": 1,
        "dic_enum_name": "已保存",
        "file": [
            {
                "id_in_module": 15,
                "file_path": "www",
                "file_ext": "tt",
                "upload_user_id": 4,
                "updated_at": "2019-08-23 14:24:41",
                "file_name": "aa",
                "module": "010",
                "created_at": "2019-08-23 14:24:41",
                "remark": "gff",
                "id": 87,
                "upload_user_name": "12",
                "file_size": 11
            }
        ],
        "creator_user_name": "w",
        "updated_at": "2019-08-23 14:24:41",
        "sum_with_tax": 10.11,
        "creator_org_name": "q",
        "detail": [
            {
                "requirement_plan_id": 15,
                "price_without_tax": 1.00,
                "num": 1,
                "price_with_tax": 2.10,
                "specification": "1",
                "remark": "123456",
                "tax_rate": 1,
                "unit": "元",
                "tax_fee": 1.00,
                "sum_with_tax": 10.11,
                "name": "e",
                "id": 2,
                "supplier_name": "aa"
            }
        ],
        "create_date": "2019-08-22",
        "status": 10040001
    },
    "status": "0"
  }
   *
   */
  return axios({
    url: api.queryone,
    method: 'post',
    params: parameter
  })
}
export function getSerialNumber (parameter) {
  return axios({
    url: api.serial_number,
    method: 'post'
  })
}
export function handleDemolition (data, type, parameter) {
  switch (type) {
    case 'create':
      return createRequire(data)
    case 'delete':
      return batchDeletePurchase(data, parameter)
    case 'update':
      return updatePurchase(data)
    case 'retrieve':
      return getPurchaseList(data, parameter)
    case 'submit':
      return submitRequire(data)
    case 'cancel':
      return cancelPurchase(data)
    default:
      break
  }
}
