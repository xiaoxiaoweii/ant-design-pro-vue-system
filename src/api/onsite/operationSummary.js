import { axios } from '@/utils/request'
const api = {
  querySummary: '/runRecordSummary/querySummary', //查询设备台账
}
export default api
export function querySummary (parameter) {
  return axios({
    url: api.querySummary,
    method: 'get',
    params: parameter
  })
}