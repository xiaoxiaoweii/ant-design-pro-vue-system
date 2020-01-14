import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const dicTree = () => {
  return builder([
    {
      key: 'key-01-01',
      title: '进口国产',
      dic_type_id: 'key-01-01',
      dic_type_name: '进口国产',
      icon: null,
      group: true
      // children: [
      //   {
      //     key: 'key-01-01-01',
      //     title: '进口',
      //     icon: null
      //   },
      //   {
      //     key: 'key-01-01-02',
      //     title: '国产',
      //     icon: null
      //   }
      // ]
    },
    {
      key: 'key-01-02',
      title: '资产有无',
      dic_type_id: 'key-01-02',
      dic_type_name: '资产有无',
      icon: null,
      group: true
      // children: [
      //   {
      //     key: 'key-01-02-01',
      //     title: '有',
      //     icon: null
      //   },
      //   {
      //     key: 'key-01-02-02',
      //     title: '无',
      //     icon: null
      //   }
      // ]
    },
    {
      key: 'key-01-03',
      title: '报废类型',
      dic_type_id: 'key-01-03',
      dic_type_name: '报废类型',
      icon: null,
      group: true
      // children: [
      //   {
      //     key: 'key-01-03-01',
      //     title: '正式报废',
      //     icon: null
      //   },
      //   {
      //     key: 'key-01-03-02',
      //     title: '提前报废',
      //     icon: null
      //   }
      // ]
    }
  ])
}

const totalCount = 5701

const serverList = options => {
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
      key: tmpKey,
      id: tmpKey,
      is_valid: Math.random() > 0.5 ? '1' : '0',
      remark: Mock.mock('@string'),
      dic_enum_id: tmpKey,
      dic_enum_name: Mock.mock('@string'),
      updatedAt: Mock.mock('@datetime'),
      editable: false
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

Mock.mock(/\/api\/dictionary\/all/, 'get', dicTree)
Mock.mock(/\/api\/dictionary\/single/, 'get', serverList)
