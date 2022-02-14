import { apiClient } from '@/service/index'

export default {
  localSignUp(data){
    return apiClient.post('/user', data)
  },
  localSignIn(data){
    return apiClient.post('/auth/local', data)
  },
  sendEmail(data){
    return apiClient.post('/auth/forgot/password/token', data)
  },
  passwordReset(data){
    return apiClient.patch('/auth/forgot/password', data)
  }

}
