import api from './index'
import { axios } from '@/utils/request'
import { jsonToFormData } from '@/utils/util'

export function login1 (data) {
  return axios({
    url: api.testLogin,
    method: 'post',
    data: jsonToFormData(data)
  })
}

export function login (data) {
  /**
   *
   * @api {POST} /assets/login 1. 用户登录
   * @apiName 1. 用户登录
   * @apiGroup AUTH
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} userId 用户ID
   *
   * @apiSuccess (200) {String} msg 文本信息
   * @apiSuccess (200) {String} status 状态
   *
   * @apiParamExample  {form-data} Request-Example:
   *
   * {
   *     userId: 142718
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     msg: "登录成功"
   *     status: "0"
   * }
   *
   */

  return axios({
    url: api.login,
    method: 'post',
    data: jsonToFormData(data)
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
// export function login (parameter) {
//   return axios({
//     url: '/auth/login',
//     method: 'post',
//     data: parameter
//   })
// }

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo (data) {
  return axios({
    url: api.refresh, // api.login, // '/user/info', // refresh
    method: 'post', // 'get',
    data: jsonToFormData(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: '/logout',
    method: 'post'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
