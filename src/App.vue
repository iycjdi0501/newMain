<template>
  <notification :notifications="notifications" @close="closeNotification"/>
  <Header v-if="isMain" @open:sign-in="openAndCloseModal('open')" class="header" />
  <transition name="fade">
    <sign-in @close:sign-in="openAndCloseModal('close')" v-if="signInModal" />
  </transition>
  <transition name="fade">
    <identification-modal
      @close:identify="openAndCloseIdentifyModal('close')"
      v-if="identifyModal"
    />
  </transition>
  <router-view
    :key="$route.query.keyword || $route.query.page"
  />
  <Footer v-if="!isMobile && pathToSaleHouse" />
  <router-loading v-if="routerLoading" />
</template>

<script>
import store from '@/store'
import Header from './components/template/Header'
import Footer from '@/components/template/Footer'
import SignIn from '@/components/sign/SignIn'
import Notification from '@/components/tool/Notification'
import RouterLoading from './components/tool/RouterLoading.vue'
import { mapState, mapGetters } from 'vuex'
import IdentificationModal from '@/components/sign/IdentificationModal'

export default {
  created() {
    this.mobileDetect()
    this.getTokenFromLocalStorage()
  },
  components: {
    IdentificationModal,
    Notification,
    SignIn,
    Footer,
    Header,
    RouterLoading,
  },
  computed: {
    ...mapState({
      signInModal: (state) => state.sign.modal,
      identifyModal: (state) => state.sign.identifyModal,
      notifications: (state) => state.tool.notifications,
      routerLoading: (state) => state.sign.routerLoading,
      loading: (state) => state.sign.loading,
    }),
    ...mapGetters(['loggedIn', 'isMobile']),
    pathToSaleHouse(){
      return this.$route.path === '/buyer' ? false : true
    },
    isMain() {
      return this.$route.path === '/' ? false : true
    }
  },
  methods: {
    openAndCloseModal(state) {
      if (state === 'open') {
        this.$store.commit('OPEN_SIGN_IN_MODAL')
      } else if (state === 'close') {
        this.$store.commit('CLOSE_SIGN_IN_MODAL')
        this.$store.commit('END_ROUTER_LOADING')
      } else {
        console.log(new Error('Wrong parameter'))
      }
    },
    openAndCloseIdentifyModal(state) {
      if (state === 'open') {
        this.$store.commit('OPEN_IDENTIFY_MODAL')
      } else if (state === 'close') {
        this.$store.commit('CLOSE_IDENTIFY_MODAL')
      } else {
        console.log(new Error('Wrong parameter'))
      }
    },
    closeNotification(id) {
      this.$store.commit('HIDE_NOTIFICATION', id)
    },
    mobileDetect() {
      if (window.innerWidth <= 1024) {
        this.$store.commit('ACCESS_BY_MOBILE')
      }
    },
    getTokenFromLocalStorage() {
      const token = localStorage.getItem('token')
      if (!this.loggedIn && token) {
        this.$store.dispatch('setTokenFromLocalStorage', token).catch(() => {
          store.commit('REMOVE_TOKEN')
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import 'assets/font/NotoSansKR/_NotoSansKR.css';

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  word-break: keep-all;
  word-wrap: break-word;
}
a{
  text-decoration: none;
}
a:visited{
  color: white;
  text-decoration: none;
}

#app {
  color: $color-default;
  font: {
    family: 'Noto Sans KR', sans-serif;
    weight: 300;
  }
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  overflow: hidden;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-active {
  transition: 1.5s;
}

body {
  min-width: 1280px;
}

@media (max-width: 1024px) {
  body {
    min-width: 0;
    overscroll-behavior: contain;
  }
}
</style>
