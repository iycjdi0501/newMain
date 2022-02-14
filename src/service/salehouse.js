import { apiClient } from '@/service/index'

export default {
  // getDefaultHouse(data) {
  //   return apiClient.get('/real-estate/coordinate', { params: data })
  // },
  getDefaultHouse(data) {
    return apiClient.get('/real-estate/cluster', { params: data })
  },
  getSalehouseInfos(data) {
    return apiClient.get('/real-estate', { params: data })
  },
  checkWish(id) {
    return apiClient.post(`/user/wish-list/${id}`)
  },
  uncheckWish(id) {
    return apiClient.delete(`/user/wish-list/${id}`)
  },
  getAddressComplete(q) {
    return apiClient.get('/elasticsearch/address-autocomplete', {
      params: { q: q },
    })
  },
}
