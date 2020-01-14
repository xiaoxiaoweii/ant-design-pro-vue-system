import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// const Random = Mock.Random
const totalCount = 5701

const acceptanceList = options => {
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
      equipment_management_code: Mock.mock('@integer(0, 90000)'),
      equipment_name: `Equiment ${i}`,
      model: Mock.mock('@string'),
      manufacturer: Mock.mock('@string'),

      production_date: Mock.mock('@date'),
      tech_state: Mock.mock('@string'),
      work_place: Mock.mock('@string'),
      exist: `${Math.random() > 0.5 ? '有' : '无'}`,
      unused_date: Mock.mock('@date'),

      contract_sign_date: Mock.mock('@date'),
      supplier_name: Mock.mock('@string'),
      spec: Mock.mock('@string'),
      acceptance_date: Mock.mock('@date'),
      acceptance_place: Mock.mock('@string'),
      org_use_name: Mock.mock('@string'),
      total_price: Mock.mock('@float(0, 100000)'),
      approver: Mock.mock('@string'),
      approvalDate: Mock.mock('@date')
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

Mock.mock(/\/api\/acceptance\/queryall/, 'get', acceptanceList)
