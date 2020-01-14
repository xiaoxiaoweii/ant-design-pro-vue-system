import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// const Random = Mock.Random
const totalCount = 5701

const transferList = options => {
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
      approver: Mock.mock('@string'),
      approvalDate: Mock.mock('@date'),
      operator_in_user_name: '冯',
      created_at: '2019-08-14 14:17:02',
      transfer_code: '123456',
      transfer_date: '2019-08-06',
      org_in_name: '机械部',
      operator_out_user_name: '张',
      org_in_code: '13',
      operator_out_user_id: 2,
      updated_at: '2019-08-16 14:37:06',
      operator_in_user_id: 1,
      org_out_name: this.$store.state.org_name,
      remark_transfer: '哈哈哈',
      org_out_code: '12',
      transfer_project_out: Mock.mock('@string'),
      transfer_project_in: Mock.mock('@string')
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

Mock.mock(/\/api\/transfer\/request/, 'get', transferList)
