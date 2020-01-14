import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const Random = Mock.Random
const totalCount = 5701

const purchaseList = options => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNum)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? totalCount % pageSize : pageSize) + 1
  const status = ['10040001', '10040002', '10040003', '10040004', '10040005']

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      id: tmpKey,
      status: status[Mock.mock('@integer(0, 4)')],
      editable: false,
      request_code: Random.guid(),
      create_date: Mock.mock('@date'),
      creator_user_name: `Edward King ${i}`,
      total_amount: 32,
      reason: `无聊呗. ${i}`,
      remark: '备注',
      approver: '张三',
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

Mock.mock(/\/api\/purchase\/request/, 'get', purchaseList)
