//设备材料价格库
import { axios } from '@/utils/request'
const api = {
  queryMaterialPriceList: '/runRecordSummary/querySummary', //查询设备材料价格库
}
export default api
export function queryMaterialPriceList (parameter) {
  return axios({
    url: api.queryMaterialPriceList,
    method: 'get',
    params: parameter
  })
}