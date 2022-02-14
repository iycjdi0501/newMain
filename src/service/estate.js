import { apiClient } from '@/service/index'

export default {
  postRealEstate(data) {
    return apiClient.post('/real-estate', data)
  },
  updateRealEstate({ id, form }) {
    return apiClient.patch(`/real-estate/${id}`, form)
  },
  getMyRealEstateList({ currentPage, limit, pageSize }) {
    return apiClient.get('/user/real-estate', {
      params: { currentPage, limit, pageSize },
    })
  },
  wishTheEstate(realEstateId) {
    return apiClient.post(`/user/wish-list/${realEstateId}`)
  },
  unWishTheEstate(realEstateId) {
    return apiClient.delete(`/user/wish-list/${realEstateId}`)
  },
  getMyRealEstate(realEstateId) {
    return apiClient.get(`/real-estate/${realEstateId}/my`)
  },
  getRealEstate(realEstateId) {
    return apiClient.get(`/real-estate/${realEstateId}`)
  },
  deleteMyRealEstate(realEstateId) {
    return apiClient.delete(`/real-estate/${realEstateId}`)
  },
  getMyWishList({ currentPage, limit, pageSize }) {
    return apiClient.get('/user/wish-list', {
      params: { currentPage, limit, pageSize },
    })
  },
  postCallRequest(data) {
    return apiClient.post('/call-request', data)
  },
  postBrokerageRequest(data) {
    return apiClient.post('/brokerage-request', data)
  },
  patchEstateTraded({ id }) {
    return apiClient.patch(`/real-estate/${id}/traded`)
  },
}
