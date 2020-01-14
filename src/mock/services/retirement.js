import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const Random = Mock.Random
const totalCount = 5701

const retirementList = options => {
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
      // key: tmpKey,
      id: tmpKey,
      status: Mock.mock('@integer(0, 3)'),
      editable: false,
      creator_user_id: Random.guid(),
      creator_user_name: `Edward King ${i}`,
      create_date: Mock.mock('@date'),
      creator_org_code: Random.guid(),
      creator_org_name: `Department ${i}`,
      reason: `无聊呗. ${i}`,
      remark: '备注',
      approver: '张三',
      approvalDate: Mock.mock('@date'),
      retirement_date: Mock.mock('@date'),
      equipment_number: Mock.mock('@integer(0, 100)'),
      total_original_value: Mock.mock('@float(0, 100000)'),
      total_net_value: Mock.mock('@float(0, 100000)'),
      dic_enum_name: Mock.mock('@string')
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

Mock.mock(/\/api\/retirement\/query/, 'get', retirementList)
