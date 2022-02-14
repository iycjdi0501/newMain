<template>
  <div class="main-top-container">
    <div class="inner">
      <div class="main-top">
        <div class="main-top-logo">
          <a href="/">
            <img
              src="../../assets/image/Apart_logo.png"
              alt=""
              class="main_logo"
            />
          </a>

        </div>
        <div class="main-top-nav">
          <div class="nav-sellhouse">
            <router-link :to="{ name: 'SellerMain' }"> 집내놓기</router-link>
          </div>
          <div class="nav-buyhouse">
            <router-link :to="{ name: 'SaleHouse' }"> 집구하기</router-link>
          </div>
          <div class="nav-realestatecounsel">
            <a href="https://lawfirm.a-part.co.kr" target="_blank"
              >부동산소송</a
            >
          </div>
          <div class="contract">
            <router-link :to="{ name: 'ApartGuide' }">
              에이파트 설명서</router-link
            >
          </div>
          <overlay-menu v-if="loggedIn" :model="items">
            마이페이지
            <font-awesome-icon :icon="['fas', 'caret-down']" />
          </overlay-menu>
          <button
            v-else
            type="button"
            @click="openAndCloseModal('open')"
            class="login_button"
          >
            로그인
          </button>
        </div>
      </div>

      <div class="main-middle">
        <Carousel>
          <CarouselSlide
            v-for="(slide, index) in slides"
            :key="slide"
            :index="index"
            :visibleSlide="this.$store.state.slide.visibleSlide"
          >
            <img :src="slide" alt="" />
          </CarouselSlide>
        </Carousel>
      </div>
      <div class="main-bottom">
        <AutoComplete></AutoComplete>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import OverlayMenu from '@/components/tool/OverlayMenu'
import Carousel from './Carousel.vue'
import CarouselSlide from './CarouselSlide.vue'
import AutoComplete from '../../components/tool/AutoComplete_main.vue'
// import SideBar from '@/components/tool/SideBar'
// import Autocomplete from '@/components/tool/Autocomplete'

export default {
  components: { OverlayMenu, Carousel, CarouselSlide, AutoComplete },
  data() {
    return {
      items: [
        {
          label: '계정 설정',
          to: { name: 'Account' },
        },
        {
          label: '내 집 관리',
          to: { name: 'EstateList' },
        },
        {
          label: '찜 목록',
          to: { name: 'WishList' },
        },
        {
          label: '문의 내역',
          to: { name: 'InquiryList' },
        },
        {
          label: '로그아웃',
          command: this.signOut,
        },
      ],
      slides: [],
    }
  },
  computed: {
    ...mapState({
      userId: (state) => state.sign.userData.userId,
      sideBar: (state) => state.tool.sideBar,
    }),
    ...mapGetters(['loggedIn', 'isMobile']),
  },

  methods: {
    openOrCloseSideBar(beState) {
      if (beState) {
        this.$store.commit('OPEN_SIDE_BAR')
      } else {
        this.$store.commit('CLOSE_SIDE_BAR')
      }
    },
    signOut() {
      this.$store.commit('REMOVE_TOKEN')
    },
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
    getSlideImg: function () {
      console.log(this.$store.state.slide.slides.length)
      for (let i = 0; i < this.$store.state.slide.slides.length; i++) {
        this.slides.push(this.$store.state.slide.slides[i])
      }
    },
  },
  created() {
    this.getSlideImg()
  },
}
</script>

<style lang="scss" scoped>
.login_button {
  border: none;
  background: none;
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.main-top-container {
  width: 100%;
  height: 550px;
  background: linear-gradient(
    95.5deg,
    #31c5ce 0.12%,
    rgba(50, 149, 220, 0.9) 100%
  );

  .inner {
    width: 1080px;
    height: 100%;
    margin: 0 auto;

    .main-top {
      margin-top: 0;
      display: flex;
      width: 100%;
      height: 132px;

      .main-top-logo {
        margin: auto 0;
      }

      .main-top-nav {
        display: flex;
        width: 55%;
        margin: auto;
        color: white;
        font-size: 18px;
        font-weight: 400;
        justify-content: space-around;

        .nav-sellhouse {
        }
      }
    }
  }
}
.main-middle {
  img {
    width: 800px;
    height: 180px;
  }
}
</style>
