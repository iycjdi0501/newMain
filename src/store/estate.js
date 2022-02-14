import serviceEstate from '@/service/estate'
import { PageError } from '@/modules/error'

export const estate = {
  state: () => ({
    myEstatePages: [],
    myWishPages: [],
    myEstates: [],
    estates: [],
    loading: false,
  }),
  mutations: {
    PUSH_MY_ESTATE_PAGES(state, pageData) {
      state.myEstatePages.push(pageData)
    },
    RESET_MY_ESTATE_PAGES(state) {
      state.myEstatePages = []
    },
    PUSH_MY_WISH_PAGES(state, pageData) {
      state.myWishPages.push(pageData)
    },
    RESET_MY_WISH_PAGES(state) {
      state.myWishPages = []
    },
    PUSH_MY_ESTATES(state, estate) {
      state.myEstates.push(estate)
    },
    PUSH_ESTATES(state, estate) {
      state.estates.push(estate)
    },
    RESET_ESTATES(state) {
      state.estates = []
    },
  },
  actions: {
    async postRealEstate({ commit }, form) {
      const response = await serviceEstate.postRealEstate(form)
      const id = response.data
      commit('RESET_MY_ESTATE_PAGES')
      return id
    },
    async updateRealEstate({ commit }, { id, form }) {
      await serviceEstate.updateRealEstate({ id, form })
      commit('RESET_MY_ESTATE_PAGES')
      return id
    },
    async completeTransaction({ commit }, { id }) {
      await serviceEstate.patchEstateTraded({ id })
      commit('RESET_MY_ESTATE_PAGES')
    },
    async fetchMyEstatePages({ commit, state }, currentPage = '1') {
      if (currentPage < 1) {
        throw new PageError('You have accessed the wrong page.', 1)
      }

      let pageData = state.myEstatePages.find(
        (page) => page.currentPage === currentPage
      )

      if (!pageData) {
        const response = await serviceEstate.getMyRealEstateList({
          currentPage,
          limit: 5,
          pageSize: 10,
        })
        const responsePage = response.data

        if (responsePage.realEstates.length === 0) {
          throw new PageError(
            'There is no data on that page.',
            responsePage.endPage
          )
        } else {
          responsePage.currentPage = currentPage
          commit('PUSH_MY_ESTATE_PAGES', responsePage)
          pageData = responsePage
        }
      }

      return pageData
    },
    async fetchMyWishPages({ commit, state }, currentPage = '1') {
      if (currentPage < 1) {
        throw new PageError('You have accessed the wrong page.', 1)
      }

      let pageData = state.myWishPages.find(
        (page) => page.currentPage === currentPage
      )

      if (!pageData) {
        const response = await serviceEstate.getMyWishList({
          currentPage,
          limit: 15,
          pageSize: 10,
        })
        const responsePage = response.data

        if (responsePage.realEstates.length === 0) {
          throw new PageError(
            'There is no data on that page.',
            responsePage.endPage
          )
        } else {
          responsePage.currentPage = currentPage
          commit('PUSH_MY_WISH_PAGES', responsePage)
          pageData = responsePage
        }
      }

      return pageData
    },
    async fetchMyEstate({ commit, state }, id) {
      let estate = state.myEstates.find((estate) => estate._id === id)
      if (!estate) {
        const estateResponse = await serviceEstate.getMyRealEstate(id)
        estate = estateResponse.data
        commit('PUSH_MY_ESTATES', estate)
      }
      return estate
    },
    async fetchEstate({ commit, state }, id) {
      let estate = state.estates.find((estate) => estate._id === id)
      if (!estate) {
        const estateResponse = await serviceEstate.getRealEstate(id)
        estate = estateResponse.data
        commit('PUSH_ESTATES', estate)
      }
      return estate
    },
    async deleteEstate({ commit }, id) {
      await serviceEstate.deleteMyRealEstate(id)
      commit('RESET_MY_ESTATE_PAGES')
    },
    async wishTheEstate({ commit }, id) {
      await serviceEstate.wishTheEstate(id)
      commit('RESET_MY_WISH_PAGES')
      commit('RESET_ESTATES')
    },
    async unWishTheEstate({ commit }, id) {
      await serviceEstate.unWishTheEstate(id)
      commit('RESET_MY_WISH_PAGES')
      commit('RESET_ESTATES')
    },
  },
}
