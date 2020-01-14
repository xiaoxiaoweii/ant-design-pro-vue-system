import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  log: '/log/query',
  exportToexcel: '/transfer/exportExcel',
  exportTopdf: '/transfer/exportPDF'
}

export default api

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

export function getLogList (parameter) {
  /**
   *
   * @api {GET} /business/log 1. 查询日志
   * @apiName 1. 查询日志
   * @apiGroup LOG
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
   *              "user_id": 35.5,
   *              "user_name": 'lisan',
   *              "ip": '192.168.10.13',
   *              "operate_type": 1,
   *              "operate_content": "登录",
   *              "created_at": "2019-01-02 05:06:67",
   *              "updated_at": "2019-01-02 05:06:67",
   *         }
   *     ]
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.log,
    method: 'get',
    params: parameter
  })
}
