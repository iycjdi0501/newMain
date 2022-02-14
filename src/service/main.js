import { apiClient } from '@/service/index'

export default{
  getHouseInfo(data) {
    return apiClient.get(`/real-estate/${data}`)
  },
  
}