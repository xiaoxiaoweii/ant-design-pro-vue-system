import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const dicTree = () => {
  return builder([
    // {
    //   key: 'key-01',
    //   title: '十一局',
    //   icon: 'folder',
    //   children: [
    //     {
    //       key: 'key-01-01',
    //       title: '第一工程公司',
    //       icon: null,
    //       group: false,
    //       children: [
    //         {
    //           key: 'key-01-01-01',
    //           title: '工程一一分部',
    //           icon: null
    //         },
    //         {
    //           key: 'key-01-01-02',
    //           title: '工程一二分部',
    //           icon: null
    //         }
    //       ]
    //     },
    //     {
    //       key: 'key-01-02',
    //       title: 'XX局指',
    //       icon: null,
    //       group: false,
    //       children: [
    //         {
    //           key: 'key-01-02-01',
    //           title: '工程一一分部',
    //           icon: null
    //         },
    //         {
    //           key: 'key-01-02-02',
    //           title: '工程一二分部',
    //           icon: null
    //         }
    //       ]
    //     }
    //   ]
    // }
    {
      parent_id: '0',
      is_flag: '0',
      order_number: 1,
      level_number: 1,
      id: 1,
      scope_code: '0000100011',
      scope_name: '中铁十一局集团有限公司'
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

Mock.mock(/\/api\/permission\/treeinfo/, 'get', dicTree)
Mock.mock(/\/api\/permission\/userstation/, 'get', serverList)
