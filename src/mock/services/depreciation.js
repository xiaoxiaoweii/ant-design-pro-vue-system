import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// const Random = Mock.Random
const totalCount = 5701

const depreciationList = options => {
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
      status: Mock.mock('@integer(0, 3)'),
      creator_org_code: Mock.mock('@integer(0, 9999)'),
      creator_org_name: Mock.mock('@string'),
      creator_user_id: Mock.mock('@integer(0, 9999)'),
      creator_user_name: Mock.mock('@string'),
      serial_number: Mock.mock('@integer(10000, 99999)'),
      approver: Mock.mock('@string'),
      create_date: Mock.mock('@date')
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

Mock.mock(/\/api\/depreciation\/request/, 'get', depreciationList)
