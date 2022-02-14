import { apiClient } from '@/service/index'

export default {
  checkPhoneVerification(imp_uid) {
    return apiClient.post('/iamport/phone-verification', imp_uid)
  },
  getUserInfo(data) {
    return apiClient.get('/auth', { params: data })
  },
  modifyUserInfo(data) {
    return apiClient.patch('/user', data)
  },
  userSecession(){
    return apiClient.delete('/user')
  }
}
