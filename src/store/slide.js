import slideOne from '../assets/image/slideOne.png'
import slideTwo from '../assets/image/slideTwo.png'

export const slide = {
  state: () => ({
    slides: [slideOne, slideTwo],
    visibleSlide: 0,
    direction: '',
    backgroundColorNum: 0,
  }),
  mutations: {
    leftSlide(state) {
      console.log('3')
      state.direction = 'left'
      if (state.visibleSlide <= 0) {
        state.visibleSlide = state.slides.length - 1
      } else {
        state.visibleSlide--
      }
    },
    rightSlide(state) {
      state.direction = 'right'
      if (state.visibleSlide >= state.slides.length - 1) {
        state.visibleSlide = 0
      } else {
        state.visibleSlide++
      }
    },
  },
  actions: {
    leftClick(context) {
      context.commit('leftSlide')
    },
    leftClick_changBg(context) {
      context.commit('changeBgMinus')
    },
    rightClick(context) {
      context.commit('rightSlide')
    },
    rightclick(context) {
      context.commit('changBgPlus')
    },
  },
}
