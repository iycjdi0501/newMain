import serviceInquiry from '@/service/inquiry'
import { PageError } from '@/modules/error'

export const inquiry = {
  state: () => ({
    myInquiryPages: [],
    myInquiries: [],
  }),
  mutations: {
    PUSH_MY_INQUIRY_PAGES(state, pageData) {
      state.myInquiryPages.push(pageData)
    },
    RESET_MY_INQUIRY_PAGES(state) {
      state.myInquiryPages = []
    },
    PUSH_MY_INQUIRIES(state, inquiry) {
      state.myInquiries.push(inquiry)
    },
  },
  actions: {
    async postInquiry({ commit }, form) {
      const response = await serviceInquiry.postInquiry(form)
      const id = response.data
      commit('RESET_MY_INQUIRY_PAGES')
      return id
    },
    async fetchMyInquiryPages({ commit, state }, currentPage = '1') {
      if (currentPage < 1) {
        throw new PageError('You have accessed the wrong page.', 1)
      }

      let pageData = state.myInquiryPages.find(
        (page) => page.currentPage === currentPage
      )
      if (!pageData) {
        const response = await serviceInquiry.getMyInquiryList({
          currentPage,
          limit: 10,
          pageSize: 10,
        })
        const responsePage = response.data

        if (responsePage.inquiries.length === 0) {
          throw new PageError(
            'There is no data on that page.',
            responsePage.endPage
          )
        } else {
          responsePage.currentPage = currentPage
          commit('PUSH_MY_INQUIRY_PAGES', responsePage)
          pageData = responsePage
        }
      }

      return pageData
    },
    async fetchMyInquiry({ commit, state }, id) {
      let inquiry = state.myInquiries.find((inquiry) => inquiry._id === id)
      if (!inquiry) {
        const inquiryResponse = await serviceInquiry.getMyInquiry(id)
        inquiry = inquiryResponse.data
        commit('PUSH_MY_INQUIRIES', inquiry)
      }
      return inquiry
    },
  },
}
