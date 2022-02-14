import { apiClient } from '@/service/index'

export default {
  setHeaderToken(token) {
    return (apiClient.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`)
  },
  removeHeaderToken() {
    return delete apiClient.defaults.headers.common['Authorization']
  },
  getTokenWithKakao(accessToken) {
    return apiClient.post('/auth/kakao', {
      accessToken,
    })
  },
  renewToken() {
    return apiClient.get('/token/token-renewal')
  },
  getUserData(needsProperties) {
    const params = {}
    needsProperties.forEach((property) => {
      params[property] = true
    })
    return apiClient.get('/auth', { params })
  },
}
