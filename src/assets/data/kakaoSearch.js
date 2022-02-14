import axios from 'axios'
let headerDict = {
  Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_REST_KEY}`,
}

export default {
  kakaoSearchKeyword(keyword) {
    return axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword?query=${keyword}`,
      { headers: headerDict }
    )
  },
}
