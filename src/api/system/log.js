import { axios } from '@/utils/request'

const api = {
  log: '/log/query'
}

export default api

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
