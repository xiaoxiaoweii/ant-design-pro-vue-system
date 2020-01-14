import Mock from 'mockjs2'
import data from './data.json'

Mock.mock('/business/123/ledger/queryFacility',{code:200,data:data.responsePageInfo})