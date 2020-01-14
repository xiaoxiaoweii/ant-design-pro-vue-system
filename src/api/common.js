import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

const api = {
  picUrl: '/',
  upload: '/business/file/upload',
  view: '/file/view',
  download: '/file/download',
  delAttachment: '/file/delfile',
  file: '/file/queryfile',
  hr: (path) => `/hr/${path}`,
  equList: '/equList',
  allEquip: '/equipment/all?equipment_code=NULL',
  single: '/equipment/single',
  // queryAllCategory:'/selectByMaterielName',
  // 合同引入
  queryAllContract: '/quote/queryAllContract',

  queryByEquipment: '/selectCategoryInfo',
  queryAllCategory: '/quote/queryAllCategory',
  queryByCategory: '/quote/queryByCategory',
  // queryByCategory:'/selectMultipleConditions',
  selectByMaterielName: 'selectCategoryNameorCode',
  // 查询所有设备类型
  queryAllEquipment: '/quote/queryAllEquipment',
  // queryAllEquipment: '/selectCategory',

  // 模糊搜索设备类型
  fuzzysearchEquipment: '/quote/fuzzysearchEquipment',
  // 查询所有合同号码
  queryContractCode: '/contract/queryContractCode',
  // 模糊查询合同号码
  queryLikeContractCode: '/contract/queryLikeContractCode',
  // 模糊搜索合同号码
  fuzzySearchById: '/contracts/fuzzySearchById',
  // 根据设备类型查询设备或者子设备类型
  queryByEquipment2: '/quote/queryByEquipment',
  queryByEquipment: '/selectCategoryInfo',
  // 查询一个审批有几个人审了
  queryApprover: '/flow/queryApprover',
  // 获取HR树中的岗位树
  stationtree: '/stationtree',
  // 获取HR树中的组织树
  orgtree: '/orgtree',
  // 根据岗位id获取人员信息
  getUsers: '/users',
  // 调拨设备
  resource: '/transfer/resource',
  // 资产类别
  queryAssetsCategory: '/quote/queryAssetsCategory',
  // 退出
  logout: '/logout',
  // 退出
  openid: '/openid',
  // 根据岗位id获取人员信息
  treeinfo: '/permission/treeinfo',
  dictionary: '/dictionary/single',

  queryEquipType: '/selectCategory',
  queryEquipInfo: '/selectCategoryInfo ',

  selectAccessories: '/selectAccessories',
  SupplierInfo:'/selectSupplierInfo',
  projectname: '/selectByProject',
  equipmentSupply: '/quote/queryEquipmentSupply', // 设备供应商
  condInfo: '/selectCondInfo', // 分包商
  equipMaterial: '/materialOut/queryEquipMaterial'
}


export default api
export function queryAllContract (parameter) {
  return axios({
    url: api.queryAllContract,
    method: 'get',
    params: parameter
  })
}

export function queryEquipInfo (data) {
  return axios.post(api.queryEquipInfo, data, {headers: {'Content-Type': 'application/json'}})
}

export function selectSupplierInfo (data) {
  return axios.post(api.SupplierInfo, data, {headers: {'Content-Type': 'application/json'}})
}

export function queryEquipType (data) {
  return axios.post(api.queryEquipType, data, {headers: {'Content-Type': 'application/json'}})
}

export function selectAccessories (data) {
  return axios.post(api.selectAccessories, data, {headers: {'Content-Type': 'application/json'}})
}

export function queryProjectName(parameter) {
  return axios({
    url: api.projectname,
    method: 'get',
    params: parameter
  })
}

export function queryByEquipment2 (data) {
  return axios.post(api.queryByEquipment,data,{
    headers:{'Content-Type':'application/json'}
  })
}

export function selectByMaterielName(data) {
  return axios.post(api.selectByMaterielName, data, {headers: {'Content-Type': 'application/json'}})
}

export function getdictionary (parameter) {
  return axios({
    url: api.dictionary,
    method: 'get',
    params: parameter
  })
}
export const uploadUrl = api.upload

export const formStatus = {
  saved: 10040001, // 已保存
  submitted: 10040002, // 已提交
  approval: 10040003, // 审批中
  returned: 10040004, // 已退回
  approved: 10040005, // 审批完成
  approve: 10040006 // 待审批
}

export function openid (parameter) {
  return axios({
    url: api.openid,
    method: 'get',
    params: parameter
  })
}


export function logout () {
  return axios({
    url: api.logout,
    method: 'post'
  })
}

export function queryAssetsCategory (parameter) {
  return axios({
    url: api.queryAssetsCategory,
    method: 'get',
    params: parameter
  })
}

export function getOrgtree (parameter) {
  return axios({
    url: api.orgtree,
    method: 'get',
    params: parameter
  })
}
export function getTreeinfo (parameter) {
  return axios({
    url: api.treeinfo,
    method: 'get',
    params: parameter
  })
}

export function getResource (parameter) {
  return axios({
    url: api.resource,
    method: 'get',
    params: parameter
  })
}

export function fuzzySearchById (data) {
  return axios({
    url: api.fuzzySearchById,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getImgView (data) {
  return axios({
    url: api.view,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function getUsers (parameter) {
  return axios({
    url: api.getUsers,
    method: 'get',
    params: parameter
  })
}

export function queryContractCode (parameter) {
  return axios({
    url: api.queryContractCode,
    method: 'get',
    params: parameter
  })
}

export function queryLikeContractCode (data) {
  return axios({
    url: api.queryLikeContractCode,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function queryByEquipment (data) {
  return axios({
    url: api.queryByEquipment,
    method: 'post',
    params: jsonToFormData(data)
  })
}

export function fuzzysearchEquipment (parameter) {
  return axios({
    url: api.fuzzysearchEquipment,
    method: 'get',
    params: parameter
  })
}

export function queryAllEquipment (parameter) {
  return axios({
    url: api.queryAllEquipment,
    method: 'get',
    params: parameter
  })
}

export function queryAllCategory (parameter) {
  return axios({
    url: api.queryAllCategory,
    method: 'get',
    params: parameter
  })
}

export function queryByCategory (parameter) {
  return axios({
    url: api.queryByCategory,
    method: 'get',
    params: parameter
  })
}

export function handleStationtree (parameter) {
  return axios({
    url: api.stationtree,
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

export function getAllEquip (parameter) {
  return axios({
    url: api.allEquip,
    method: 'get',
    params: parameter
  })
}

export function getSingle (parameter) {
  return axios({
    url: api.single,
    method: 'get',
    params: parameter
  })
}

export const formStatusLabel = {
  10040001: '已保存',
  10040002: '已提交',
  10040003: '审批中',
  10040004: '已退回',
  10040005: '审批完成',
  10040006: '待审批'
}

export const formStatusArray2 = [
  {
    text: '合格',
    value: '1'
  },
  {
    text: '警示',
    value: '2'
  }
]

export const formStatusArray3 = [
  {
    text: '企业',
    value: '1'
  },
  {
    text: '个体工商户',
    value: '2'
  },
  {
    text: '个人',
    value: '3'
  }
]

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
    text: '待审批',
    value: '10040006'
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

export const modules = {
  purchase: '001', // 购置申请单模块
  acceptance: '002', // 验收申请单模块
  use: '003', // 调拨申请单模块
  retirement: '005', // 报废申请单模块
  inventory: '006', // 盘点单模块
  businesscard: '009', // 资产卡片模块
  disposal: '010', // 资产处置模块
  onsite: '020' //设备现场管理
}
export const formContent = [
  {
    text: '用户登陆',
    value: '用户登陆'
  },
  {
    text: '数据编辑',
    value: '数据编辑'
  },
  {
    text: '系统管理',
    value: '系统管理'
  }
]
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
    url: api.export,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function getAttachments (data) {
  /**
   *
   * @api {POST} /business/purchase/request/export 2. 查询附件
   * @apiName 2. 查询附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} id 表单id
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   * {
   *     id : 1,
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   *  stream //文件流
   *
   */

  return axios({
    url: api.file,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function downloadAttachment (data) {
  /**
   *
   * @api {POST} /business/purchase/request/download 3. 上传附件
   * @apiName 3. 上传附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} filePath 文件路径
   * @apiParam  {String} fileName 文件明
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     filePath: "部门组织.png"
   *     fileName: "D:/tmp/retirement/20190814/"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "下传成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.download,
    method: 'post',
    data: jsonToFormData(data),
    responseType: 'blob'
  })
}

export function delAttachment (data) {
  /**
   *
   * @api {POST} /business/purchase/request/delfile 4. 删除附件
   * @apiName 4. 删除附件
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} filePath 文件路径
   * @apiParam  {String} fileName 文件明
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     filePath: "部门组织.png"
   *     fileName: "D:/tmp/retirement/20190814/"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "下传成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.delAttachment,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function hr (path) {
  /**
   *
   * @api {POST} /business/hr/${path} 5. 获取人力资源系统相关信息
   * @apiName 5. 获取人力资源系统相关信息
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     path: "部门组织.png"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "查询成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.hr(path),
    method: 'get'
  })
}

export function getEquList (parameter) {
  /**
   *
   * @api {POST} /business/equList 6. 获取设备列表
   * @apiName 6. 获取设备列表
   * @apiGroup COMMON
   * @apiVersion  1.0.0
   *
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     "eName":"盾构机",
   *     "eSpecs":"M30"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "查询成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.equList,
    method: 'get',
    params: parameter
  })
}


/**
 * 获取设备供应商
 * @param {Object} parameter
 */
export function getEquipmentSupply (parameter) {
  return axios({
    url: api.equipmentSupply,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取分包商列表
 * @param {Object} data
 */
export function getCondInfo (data) {
  return axios({
    url: api.condInfo,
    method: 'post',
    data: data
  })
}

/**
 * 获取退场设备材料列表
 * @param {Object} parameter
 */
export function getEquipMaterial (parameter) {
  return axios({
    url: api.equipMaterial,
    method: 'get',
    params: parameter
  })
}
