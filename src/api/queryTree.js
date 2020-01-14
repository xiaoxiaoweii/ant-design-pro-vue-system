import { axios } from '@/utils/request'
// import { jsonToFormData } from '@/utils/util'

const api = {
  dictionary: '/quote/queryAllEquipment',
  queryByEquipment: '/quote/queryByEquipment'
}

export default api

export function getDictionaryTree (parameter) {
  /**
   *
   * @api {GET} /business/dictionary/all 1. 查询字典树
   * @apiName 1. 查询字典树
   * @apiGroup DICTIONARY
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
    url: api.dictionary,
    method: 'get',
    params: parameter
  })
}

export function getDictionaryEnum (parameter) {
  /**
   *
   * @api {GET} /business/dictionary/single?dic_type_id=1004 2. 查询字典枚举
   * @apiName 2. 查询字典枚举
   * @apiGroup DICTIONARY
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
   *              "dic_type_id": '11202',
   *              "dic_type_name": 'lisan',
   *              "dic_enum_id": '192.168.10.13',
   *              "dic_enum_name": 1,
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
    url: api.enum,
    method: 'get',
    params: parameter
  })
}

// export function dictionaryEnum (data) {
//   /**
//    *
//    * @api {GET} /business/dictionary/single?_method=put 3. 更新字典枚举
//    * @apiName 3. 更新字典枚举
//    * @apiGroup DICTIONARY
//    * @apiVersion  1.0.0
//    *
//    *
//    *
//    * @apiSuccess (200) {String} msg 文本信息
//    * @apiSuccess (200) {String} status 状态
//    * @apiSuccess (200) {Object} responseList 数据集合
//    *
//    *
//    *
//    * @apiSuccessExample {json} Success-Response:
//    * {
//    *     msg : "操作成功.",
//    *     responseList: [
//    *         {
//    *              "id": "id123",
//    *              "dic_type_id": '11202',
//    *              "dic_type_name": 'lisan',
//    *              "dic_enum_id": '192.168.10.13',
//    *              "dic_enum_name": 1,
//    *              "created_at": "2019-01-02 05:06:67",
//    *              "updated_at": "2019-01-02 05:06:67",
//    *         }
//    *     ]
//    *     status : "0"
//    * }
//    *
//    *
//    */
//   return axios({
//     url: `${api.enum}${data.dic_enum_id ? '?_method=PUT' : ''}`,
//     method: 'post',
//     data: jsonToFormData(data)
//   })
// }
