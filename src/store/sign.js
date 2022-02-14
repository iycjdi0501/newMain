import kakao from '@/modules/kakao'
import axios from 'axios'
import serviceSign from '@/service/sign'
import jwt_decode from 'jwt-decode'
import router from '@/router'
import store from '@/store/index'

export const sign = {
  state: () => ({
    token: '',
    modal: false,
    identifyModal: false,
    loading: false,
    routerLoading: false,
    userData: {},
  }),
  mutations: {
    OPEN_SIGN_IN_MODAL(state) {
      state.modal = true
    },
    CLOSE_SIGN_IN_MODAL(state) {
      state.modal = false
    },
    OPEN_IDENTIFY_MODAL(state) {
      state.identifyModal = true
    },
    CLOSE_IDENTIFY_MODAL(state) {
      state.identifyModal = false
    },
    START_LOADING(state) {
      state.loading = true
    },
    END_LOADING(state) {
      state.loading = false
    },
    START_ROUTER_LOADING(state) {
      state.routerLoading = true
    },
    END_ROUTER_LOADING(state) {
      state.routerLoading = false
    },
    async SET_TOKEN(state, token) {
      serviceSign.setHeaderToken(token)
      localStorage.setItem('token', token)
      state.token = token
      state.userData = jwt_decode(token)
      const userIdResponse = await serviceSign.getUserData(['userId'])
      state.userData.userId = userIdResponse.data.userId
    },
    REMOVE_TOKEN(state) {
      serviceSign.removeHeaderToken()
      localStorage.removeItem('token')
      state.token = ''
      state.userData = {}
      store.commit('RESET_MY_ESTATE_PAGES')
      store.commit('RESET_MY_WISH_PAGES')
      store.commit('RESET_MY_INQUIRY_PAGES')
      router.push({ name: 'Main' })
    },
  },
  actions: {
    async setTokenFromKakao({ commit }, authCode) {
      const tokenUrl = kakao.getKakaoTokenUrl(authCode)
      const kakaoTokenResponse = await axios.get(tokenUrl)
      const kakaoAccessToken = kakaoTokenResponse.data.access_token
      const tokenResponse = await serviceSign.getTokenWithKakao(
        kakaoAccessToken
      )
      const token = tokenResponse.data.accessToken
      commit('SET_TOKEN', token)
    },
    async setTokenFromLocalStorage({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    async renewToken({ commit }) {
      const tokenResponse = await serviceSign.renewToken()
      const token = tokenResponse.data.accessToken
      commit('SET_TOKEN', token)
    },
  },
  getters: {
    loggedIn: (state) => {
      return !!state.token
    },
  },
}
