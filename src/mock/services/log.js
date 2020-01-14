import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const Random = Mock.Random
const totalCount = 5701

const logList = options => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNum)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? totalCount % pageSize : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      id: tmpKey,
      user_id: Random.guid(),
      user_department: Mock.mock('@string'),
      user_name: Mock.mock('@string'),
      user_position_code: Random.guid(),
      user_position: Mock.mock('@string'),
      ip: Random.ip(),
      operate_type: Mock.mock('@integer(0, 3)'),
      operate_content: '登录',
      created_at: Mock.mock('@date'),
      update_at: Mock.mock('@date')
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

Mock.mock(/\/api\/log\/request/, 'get', logList)
