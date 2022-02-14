const impConfig = {
  initializeKey: process.env.VUE_APP_IAMPORT_KEY,
  redirectUri: `${process.env.VUE_APP_CLIENT_URL}/callback/imp/verification`,
}

export default {
  getInitializeKey() {
    return impConfig.initializeKey
  },
  getRedirectUri() {
    return impConfig.redirectUri
  },
}

// TODO 리펙터링 대상