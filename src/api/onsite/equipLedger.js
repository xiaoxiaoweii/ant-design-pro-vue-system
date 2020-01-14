import { axios } from '@/utils/request'
const api = {
  queryEquip: '/ledger/queryEquip', //查询设备台账
  queryElectricityFacility: '/ledger/queryElectricityFacility', //临电台账-电闸
  queryElectricity: '/ledger/queryElectricity', //临电台账-电表
  queryWaterFacility: '/ledger/queryWaterFacility', //临水台账-水泵
  queryWater: '/ledger/queryWater', //临水台账-水表
}
export default api
export function queryEquip (parameter) {
  return axios({
    url: api.queryEquip,
    method: 'get',
    params: parameter
  })
}
//临电
export function queryElectricityFacility (parameter) {
  return axios({
    url: api.queryElectricityFacility,
    method: 'get',
    params: parameter
  })
}
export function queryElectricity (parameter) {
  return axios({
    url: api.queryElectricity,
    method: 'get',
    params: parameter
  })
}
//临水
export function queryWaterFacility (parameter) {
  return axios({
    url: api.queryWaterFacility,
    method: 'get',
    params: parameter
  })
}
export function queryWater (parameter) {
  return axios({
    url: api.queryWater,
    method: 'get',
    params: parameter
  })
}

export const equipStatusArray = [
  {
    text: '在用',
    value: '0'
  },
  {
    text: '退场',
    value: '1'
  },
  {
    text: '闲置',
    value: '2'
  },
]
export const equipStatusLabel = {
  0: '在用',
  1: '退场',
  2: '闲置',
}