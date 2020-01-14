import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  permission: '/scopeTree', // '/permission/treeinfo',
  enum: '/flow/organ',
  one: '/permission/one',
  station: '/permission/station',
  user: '/permission/user',
  menu: '/permission/menu',
  queryenum: '/flow/one',
  menuEnum: '/flow/menu'
}

export default api

export function postUserAndStation (data) {
  return axios({
    url: api.enum,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function editUtilityUserAndStation (data) {
  return axios({
    url: api.menuEnum,
    method: 'post',
    data: jsonToFormData(data),
    params: { _method: 'put' }
  })
}

export function postUtilityUserAndStation (data) {
  return axios({
    url: api.menuEnum,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getUtilityUserAndStation (parameter) {
  return axios({
    url: api.queryenum,
    method: 'get',
    params: parameter
  })
}

export function batchUtilityDelUserOrStation (data) {
  return axios({
    url: api.menuEnum,
    method: 'post',
    data: jsonToFormData(data),
    params: { _method: 'delete' }
  })
}

export function getPermissionTree (parameter) {
  /**
   *
   * @api {GET} /business/permission/treeinfo 1.根据层级获取工程树
   * @apiName 1.根据层级获取工程树
   * @apiGroup PERMISSION
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     scope_code: 0,
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     responseList: [
   *      {
   *            "parent_id": "0",
   *            "is_flag": "0",
   *            "order_number": 1,
   *            "level_number": 1,
   *            "id": 1,
   *            "scope_code": "0000100011",
   *            "scope_name": "中铁十一局集团有限公司"
   *        }
   *     ]
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.permission,
    method: 'get',
    params: parameter
  })
}

export function addPermissionTreeNode (data) {
  /**
   *
   * @api {POST} /business/permission/treeinfo 2.添加子工程树节点
   * @apiName 2.添加子工程树节点
   * @apiGroup PERMISSION
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     scope_code: 0,
   *     scope_name: 混泥土中心,
   *     parent_id: '000010001100001',
   *     level_number: 3
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "保存成功",
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.permission,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function delPermissionTreeNode (data) {
  /**
   *
   * @api {POST} /business/permission/treeinfo 3.删除子工程树节点
   * @apiName 3.删除子工程树节点
   * @apiGroup PERMISSION
   * @apiVersion  1.0.0
   *
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     scope_code: '000111',
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "删除成功",
   *     status : "0"
   * }
   *
   *
   */
  return axios({
    url: api.permission,
    method: 'post',
    data: jsonToFormData(data),
    params: { _method: 'delete' }
  })
}

export function getPermissionUserAndStation (parameter) {
  /**
   *
   * @api {GET} /business/permission/userstation?pageNum=1&pageSize=10&scope_code=0000100011 3. 查询工程节点下的人员或岗位的权限列表
   * @apiName 3. 查询工程节点下的人员或岗位的权限列表
   * @apiGroup PERMISSION
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

export function findOne (parameter) {
  /**
   *
   * @api {GET} /business/permission/one?user_station_id=123&is_flag=0&scope_code=110106280000 4. 查询人员或岗位的单条权限记录
   * @apiName 4. 查询人员或岗位的单条权限记录
   * @apiGroup permission
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
    url: api.one,
    method: 'get',
    params: parameter
  })
}

export function create (data) {
  /**
   *
   * @api {POST} /business/permission/one 5. 添加人员或岗位的单条权限记录
   * @apiName 5. 添加人员或岗位的单条权限记录
   * @apiGroup permission
   * @apiVersion  1.0.0
   *
   * @apiParam  {String} scope_code 工程树的权限编码
   * @apiParam  {String} user_station_id 人员或岗位id
   * @apiParam  {String} flag 0-人员 1-岗位
   * @apiParam  {String} menus 菜单详情
   * @apiParam  {String} user_station_id 人员或岗位id
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *    scope_code: 110106280000,
   *    user_station_id: 123,
   *    is_flag: 0,
   *    menus: [ {"menu_code":"15","authority_button_codes":"a10001,a10002,a10003,a10004"},{"menu_code":"16","authority_button_codes":"a10001,a10002,a10003"} ]
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "操作成功.",
   *     status : "0"
   * }
   *
   */
  return axios({
    url: api.one,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchAddStation (data) {
  /**
   *
   * @api {POST} /business/permission/station 6. 批量添加岗位记录
   * @apiName 6. 批量添加岗位记录
   * @apiGroup permission
   * @apiVersion  1.0.0
   *
   * @apiParam  {String} id 工程树主键ID
   * @apiParam  {String} details 岗位详情
   * @apiParam  {String} details.station_code 岗位编码
   * @apiParam  {String} details.station_name 岗位名称
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *    id: 110106280000,
   *    details: [{"station_code": "12","station_name":"测试岗位1"}, {"station_code": "123","station_name":"测试岗位2"}]
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "保存成功.",
   *     status : "0"
   * }
   *
   */
  return axios({
    url: api.station,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchAddUser (data) {
  /**
   *
   * @api {POST} /business/permission/user 7. 批量添加岗位用户
   * @apiName 7. 批量添加岗位用户
   * @apiGroup permission
   * @apiVersion  1.0.0
   *
   * @apiParam  {String} id 工程树主键ID
   * @apiParam  {String} details 用户详情列表
   * @apiParam  {String} details.user_id 用户id
   * @apiParam  {String} details.user_name 用户名
   * @apiParam  {String} details.is_flag 0：表示HR组织人员；1：表示供应商人员位名称
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   * @apiSuccess (200) {Object} responseList 数据集合
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *    id: 110106280000,
   *    details: [{"user_id": "123","is_flag": "0","user_name":"测试1"}, {"user_id": "1234","is_flag": "1","user_name":"测试2"}]
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "保存成功.",
   *     status : "0"
   * }
   *
   */
  return axios({
    url: api.user,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function batchDelUserOrStation (data) {
  /**
   *
   * @api {POST} /business/permission/menu 8. 批量添加岗位用户
   * @apiName 8. 批量添加岗位用户
   * @apiGroup permission
   * @apiVersion  1.0.0
   *
   * @apiParam  {String} scope_code 工程树的权限编码
   * @apiParam  {String} user_station_id user_station_id
   * @apiParam  {String} is_flag 0-人员 1-岗位
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *    scope_code: '110106280000',
   *    details: [{"user_station_id":"123","is_flag":"0"}, {"user_station_id":"1234","is_flag":"1"}]
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     msg : "删除成功.",
   *     status : "0"
   * }
   *
   */
  return axios({
    url: api.menu,
    method: 'post',
    data: jsonToFormData(data),
    params: { _method: 'delete' }
  })
}
