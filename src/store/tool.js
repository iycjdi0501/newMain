import { v4 as uuidV4 } from 'uuid'

export const tool = {
  state: () => ({
    mobile: false,
    sideBar: false,
    notifications: [],
  }),
  mutations: {
    SHOW_NOTIFICATION(state, notification) {
      state.notifications.push(notification)
    },
    HIDE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== id
      )
    },
    OPEN_SIDE_BAR(state) {
      state.sideBar = true
    },
    CLOSE_SIDE_BAR(state) {
      state.sideBar = false
    },
    ACCESS_BY_MOBILE(state) {
      state.mobile = true
    },
  },
  actions: {
    insertNotification({ commit }, { type = 'default', content, errorId, time = 5 }) {
      const id = uuidV4()
      commit('SHOW_NOTIFICATION', { type, content, id, errorId })
      setTimeout(() => {
        commit('HIDE_NOTIFICATION', id)
      }, time * 1000)
    },
  },
  getters: {
    isMobile: (state) => {
      return state.mobile
    },
  },
}
