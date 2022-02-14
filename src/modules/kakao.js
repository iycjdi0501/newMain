const kakaoConfig = {
  restApiKey: process.env.VUE_APP_KAKAO_KEY,
  redirectUri: `${process.env.VUE_APP_CLIENT_URL}/callback/kakao`,
}

export default {
  getKakaoAuthCodeUrl() {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoConfig.restApiKey}&redirect_uri=${kakaoConfig.redirectUri}&response_type=code`
  },
  getKakaoTokenUrl(authCode) {
    return `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaoConfig.restApiKey}&redirect_uri=${kakaoConfig.redirectUri}&code=${authCode}`
  },
}

// TODO 리펙터링 대상