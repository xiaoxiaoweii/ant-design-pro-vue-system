import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  purchase: '/equipCheck/fuzzysearch',
  submit: '/equipCheck/submit',
  edit: '/equipCheck/update',
  cancel: '/equipCheck/back',
  create: '/equipCheck/save',
  delete: '/equipCheck/delete',
  queryone: '/equipCheck/queryOne',
  export: '/transform/export',
  queryResult: '/equipCheck/queryResult'
}

export default api
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
   * @api {POST} /business/transform/export 1. 导出数据到Excel
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
// export function queryTaxRate (parameter) {
//   return axios({
//     url: api.queryTaxRate,
//     method: 'get',
//     params: parameter

//   })
// }
export function createRequire (data) {
  /**
   *
   * @api {POST} /business/transform/save 1. 创建设备运输申请表
   * @apiName 1. 创建设备运输申请
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
   * @api {POST} /business/transform/update 2. 修改运输
   * @apiName 2. 修改运输
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
   * @api {POST} /business/transform/delete 3. 批量运输
   * @apiName 3. 批量删除运输
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 需求计划ID
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
   * @api {POST} /business/transform/submit 4. 提交运输表
   * @apiName 4. 提交运输表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 需求计划ID
   * @apiParam  {Number}  flag 需求计划状态
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
   * @api {POST} /business/transform/back 4. 提交运输表
   * @apiName 4. 提交运输表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 需求计划ID
   * @apiParam  {Number} flag 需求计划状态
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
   * @api {GET} /business/transform/fuzzysearch 5. 查询运输列表
   * @apiName 5. 查询运输列表
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
   *  "msg": "查询成功",
    "responsePageInfo": {
        "total": 1,
        "list": [
            {
                "requirement_plan_id": 14,
                "creator_org_code": "1",
                "creator_user_id": 1,
                "goods_name": "t",
                "receive_site": "苏州",
                "created_at": "2019-08-24 13:54:31",
                "serial_number": "5d8c4364-7d61-4470-bccf-ea9616968e04",
                "remark": "123",
                "dic_enum_name": "已保存",
                "carrier": null,
                "creator_user_name": "w",
                "updated_at": "2019-08-24 13:54:31",
                "sum_with_tax": 2.30,
                "begin_site": "南京",
                "creator_org_name": "q",
                "client": "e",
                "id": 14,
                "create_date": "2019-08-24",
                "status": 10040001
            }
        ],
        "pageNum": 1,
        "pageSize": 1,
        "size": 1,
        "startRow": 1,
        "endRow": 1,
        "pages": 1,
        "prePage": 0,
        "nextPage": 0,
        "isFirstPage": true,
        "isLastPage": true,
        "hasPreviousPage": false,
        "hasNextPage": false,
        "navigatePages": 8,
        "navigatepageNums": [
            1
        ],
        "navigateFirstPage": 1,
        "navigateLastPage": 1,
        "firstPage": 1,
        "lastPage": 1
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
   * @api {GET} /business/transform/queryOne  6. 查询配件所有信息
   * @apiName 6. 查询配件所有信息
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
        "creator_org_code": "1",
        "creator_user_id": 1,
        "goods_name": "t",
        "receive_site": "苏州",
        "created_at": "2019-08-24 13:54:31",
        "serial_number": "5d8c4364-7d61-4470-bccf-ea9616968e04",
        "remark": "123",
        "dic_enum_name": "已保存",
        "carrier": null,
        "file": [
            {
                "id_in_module": 14,
                "file_path": "www",
                "file_ext": "tt",
                "upload_user_id": 4,
                "updated_at": "2019-08-24 13:54:31",
                "file_name": "aa",
                "module": "014",
                "created_at": "2019-08-24 13:54:31",
                "remark": "gff",
                "id": 110,
                "upload_user_name": "12",
                "file_size": 11
            }
        ],
        "creator_user_name": "w",
        "updated_at": "2019-08-24 13:54:31",
        "begin_site": "南京",
        "creator_org_name": "q",
        "client": "e",
        "id": 14,
        "detail": [
            {
                "requirement_plan_id": 14,
                "unit": "车",
                "price_without_tax": 1.20,
                "sum_with_tax": 2.30,
                "num": 1,
                "remark": "123",
                "id": 2,
                "total_without_tax": 1.50,
                "total_tax": 2.10,
                "fee_item": "r",
                "tax_rate": 1
            }
        ],
        "create_date": "2019-08-24",
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
export function getQueryResult (parameter) {
  return axios({
    url: api.queryResult,
    method: 'get'
  })
}
export function handlePurchase (data, type, parameter) {
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
