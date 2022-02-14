import { apiClient } from '@/service/index'

export default {
  postInquiry(data) {
    return apiClient.post('/inquiry', data)
  },
  getMyInquiryList({ currentPage, limit, pageSize }) {
    return apiClient.get('/user/inquiry', {
      params: { currentPage, limit, pageSize },
    })
  },
  getMyInquiry(inquiryId) {
    return apiClient.get(`/inquiry/${inquiryId}`)
  },
}
