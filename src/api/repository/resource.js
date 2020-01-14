import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  purchase: '/resource/fuzzysearch',
  export: '/resource/export'
}

export default api
export function exportToExcel (data) {
  /**
   *
   * @api {POST} /business/demolition/export 1. 导出数据到Excel
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
   * @api {POST} /business/demolition/save 1. 创建临时安拆申请表
   * @apiName 1. 创建临时安拆申请
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
   * @api {POST} /business/demolition/update  2. 修改临时安拆
   * @apiName 2. 修改临时安拆
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
   * @api {POST} /business/demolition/delete  3. 批量删除临时安拆
   * @apiName 3. 批量删除临时安拆
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} id 临时安拆ID
   * @apiParam  {Object[]} details 临时安拆详细信息ID集合
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
   * @api {POST} /business/demolition/submit  4. 提交临时安拆申请表
   * @apiName 4. 提交临时安拆计划表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 临时安拆申请ID
   * @apiParam  {Number}  flag 临时安拆申请状态
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
   * @api {POST} /business/demolition/back  4. 提交临时安拆申请表
   * @apiName 4. 提交临时安拆申请表
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number} ids 临时安拆申请表ID
   * @apiParam  {Number} flag 临时安拆申请表状态
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
   * @api {GET}  /business/demolition/fuzzysearch  5. 查询临时安拆申请表
   * @apiName 5. 查询临时安拆申请表
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
   * "msg": "查询成功",
    "responsePageInfo": {
        "total": 1,
        "list": [
            {
                "requirement_plan_id": 1,
                "creator_user_id": 1,
                "num": 1,
                "created_at": "2019-08-27 11:41:08",
                "serial_number": "0f722a33-95ee-4ae7-b5ea-35ff756391bb",
                "remark": "123",
                "creator_org_id": 1,
                "dic_enum_name": "已保存",
                "creator_user_name": "wwww",
                "updated_at": "2019-08-27 11:41:08",
                "sum_with_tax": 10.11,
                "creator_org_name": "q",
                "id": 1,
                "create_date": "2019-08-27",
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
   * @api {GET} /business/demolition/queryOne    6. 查询临时安拆申请所有信息
   * @apiName 6. 查询临时安拆申请所有信息
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
        "created_at": "2019-08-27 11:41:08",
        "serial_number": "0f722a33-95ee-4ae7-b5ea-35ff756391bb",
        "remark": "123",
        "creator_org_id": 1,
        "dic_enum_name": "已保存",
        "file": [
            {
                "id_in_module": 1,
                "file_path": "www",
                "file_ext": "tt",
                "upload_user_id": 4,
                "updated_at": "2019-08-27 11:41:08",
                "file_name": "aa",
                "module": "013",
                "created_at": "2019-08-27 11:41:08",
                "remark": "gff",
                "id": 167,
                "upload_user_name": "12",
                "file_size": 11
            }
        ],
        "creator_user_name": "wwww",
        "updated_at": "2019-08-27 11:41:08",
        "creator_org_name": "q",
        "id": 1,
        "detail": [
            {
                "requirement_plan_id": 1,
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
                "id": 1,
                "supplier_name": "aa"
            }
        ],
        "create_date": "2019-08-27",
        "status": 10040001
    },
  }
   *
   */
  return axios({
    url: api.queryone,
    method: 'post',
    params: parameter
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
