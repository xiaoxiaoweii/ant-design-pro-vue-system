import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  purchase: '/accounting/fuzzysearch',
  submit: '/accounting/submit',
  edit: '/accounting/update',
  cancel: '/accounting/back',
  create: '/accounting/save',
  delete: '/accounting/delete',
  queryone: '/accounting/queryOne',
  exportExcel: '/accounting/export',
  exportPdf: '/accounting/exportPDF'
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
    url: api.exportExcel,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function exportToPDF (data) {
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
    url: api.exportPdf,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}
export function createRequire (data) {
  /**
   *
   * @api {POST} /business/requirement/queryplan 1. 创建需求计划
   * @apiName 1. 创建需求计划
   * @apiGroup PURCHASE
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {Number}  creator_org_id  编制单位id
   * @apiParam  {Object[]} details 需求计划详细信息集合
   * @apiParam  {date} create_date 编制日期
   * @apiParam  {String}  equipment_name 设备名称
   * @apiParam  {String} remark 备注
   * @apiParam  {number} creator_user_id 编制人id
   * @apiParam  {String} creator_user_name 编制人姓名
   * @apiParam  {date} estimated_in_date 预计到场时间
   * @apiParam  {date} estimated_out_date 预计退场时间
   * @apiParam  {string} equipment_spec 规格
   * @apiParam  {string} use_site 使用部位
   * @apiParam  {number} approved_rent_num 租赁数量
   * @apiParam  {number} approved_purchase_num 采购数量
   * @apiParam  {number} approved_alloc_num 调拨数量
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
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

export function updatePurchase (data) {
  /**
   *
 * @api {POST} /business/requirement/update 2. 修改需求计划
   * @api {POST} /business/purchase/request?_method=PUT 2. 修改需求计划
   * @apiName 2. 修改需求计划
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
   * @apiParam  {date} estimated_in_date 预计到场时间
   * @apiParam  {date} estimated_out_date 预计退场时间
   * @apiParam  {string} equipment_spec 规格
   * @apiParam  {string} use_site 使用部位
   * @apiParam  {number} approved_rent_num 租赁数量
   * @apiParam  {number} approved_purchase_num 采购数量
   * @apiParam  {number} approved_alloc_num 调拨数量
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
   * @api {POST} /business/requirement/delete 3. 批量删除需求计划

   * @api {POST} /business/purchase/request?_method=DELETE 3. 批量删除需求计划
   * @apiName 3. 批量删除需求计划
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
   * @api {POST} /business/requirement/submit 4. 提交需求计划表
   * @api {POST} /business/purchase/requestsubmit 4. 提交需求计划表
   * @apiName 4. 提交需求计划表
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
   * @api {POST} /business/requirement/back 4. 提交需求计划表
   * @api {POST} /business/purchase/cancel 4. 提交需求计划表
   * @apiName 4. 提交需求计划表
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
   * @api {GET} /business/requirement/fuzzysearch 5. 查询业务需求计划列表
   * @api {GET} /business/requirement/queryplan 5. 查询业务需求计划列表
   * @apiName 5. 查询业务需求计划列表
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
                "creator_user_id": 10,
                "creator_user_name": "qq",
                "updated_at": "2019-08-16 10:05:02",
                "creator_org_name": "lrj",
                "created_at": "2019-08-16 10:05:02",
                "serial_number": "303c0ae2-6ef8-482b-bcc1-21301f31d176",
                "id": 19,
                "creator_org_id": 1,
                "create_date": "2019-08-15",
                "dic_enum_name": "已保存",
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
    }
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
   * @api {GET} /business/requirement/queryOne 6. 查询需求计划所有信息
   * @api {GET} /business/purchase/detail 6. 查询需求计划所有信息
   * @apiName 6. 查询需求计划所有信息
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
        "creator_user_id": 123,
        "created_at": "2019-08-20 17:29:24",
        "serial_number": "29349f5c-b0e3-4c84-9d8f-e9befd40ec72",
        "remark": "备注",
        "creator_org_id": 2222,
        "dic_enum_name": "已保存",
        "file": [],
        "creator_user_name": "云玑",
        "updated_at": "2019-08-20 17:52:09",
        "creator_org_name": "财务部",
        "id": 49,
        "detail": [
            {
                "equipment_name": "chn",
                "approved_purchase_num": 1,
                "equipment_code": "1",
                "approved_alloc_num": 1,
                "remark": "f",
                "equipment_spec": "gfh",
                "estimated_out_date": "2019-08-21",
                "number": 0,
                "equipment_unit": "台",
                "approved_rent_num": 1,
                "id": 36,
                "plan_id": 49,
                "estimated_in_date": "2019-08-21",
                "use_site": "fh"
            }
        ],
        "create_date": "2019-08-20",
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
