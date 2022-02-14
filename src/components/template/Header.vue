<template>
  <div class="header">
    <div class="logo-search-container">
      <router-link class="logo" :to="{ name: 'Main' }">
        <img
          :src="
            isMobile
              ? require('@/assets/logo/svg/Logo_Text-en_Row.svg')
              : require('@/assets/logo/svg/Logo_Text-en_Column.svg')
          "
          alt="A-part logo"
        />
      </router-link>
      <autocomplete v-if="!isMobile" />
    </div>
    <ul v-if="!isMobile" class="nav">
      <li>
        <router-link :to="{ name: 'ApartGuide' }"> 에이파트 설명서</router-link>
      </li>
      <li>
        <a href="https://lawfirm.a-part.co.kr" target="_blank">부동산 소송</a>
      </li>
      <li>
        <router-link :to="{ name: 'SaleHouse' }"> 집 구하기</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'SellerMain' }"> 집 내놓기</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'InquiryForm' }"> 고객 센터</router-link>
      </li>
      <li>
        <transition name="fade" mode="out-in">
          <overlay-menu v-if="loggedIn" :model="items">
            마이페이지
            <font-awesome-icon :icon="['fas', 'caret-down']" />
          </overlay-menu>
          <button v-else type="button" @click="$emit('open:signIn')">
            로그인
          </button>
        </transition>
      </li>
    </ul>

    <button v-if="isMobile" @click="openOrCloseSideBar(true)">
      <font-awesome-icon :icon="['fal', 'bars']" />
    </button>
    <side-bar
      v-if="isMobile && sideBar"
      @close="openOrCloseSideBar"
      position="right"
    >
      <div class="top-box">
        <span class="id" v-if="userId">
          <b>{{ userId }}</b>
          님
        </span>
        <transition name="fade" mode="out-in">
          <button
            v-if="loggedIn"
            type="button"
            @click="signOut"
            class="mobile-button"
          >
            로그아웃
          </button>
          <button
            v-else
            type="button"
            @click="$emit('open:signIn')"
            class="mobile-button"
          >
            로그인
          </button>
        </transition>
      </div>
      <ul class="bottom-box">
        <li>
          <router-link :to="{ name: 'SaleHouse' }">집 구하기</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'SellerMain' }">집 내놓기</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'InquiryForm' }">고객 센터</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Account' }">계정 설정</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'EstateList' }">내집 관리</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'WishList' }">찜 목록</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'InquiryList' }">문의내역</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ApartGuide' }">에이파트 설명서</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ApartGuide', query:{offSet: 'bottom'} }">에이파트 이용약관</router-link>
        </li>
        <li>
          <a href="https://lawfirm.a-part.co.kr" target="_blank">부동산 소송</a>
        </li>
      </ul>
    </side-bar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import OverlayMenu from '@/components/tool/OverlayMenu'
import SideBar from '@/components/tool/SideBar'
import Autocomplete from '@/components/tool/Autocomplete'

export default {
  components: { SideBar, OverlayMenu, Autocomplete },
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
  },
}
</script>

<style lang="scss" scoped>
.header {
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: {
    color: $background-default;
  }
  border: {
    bottom: 1px solid $border-disable;
  }

  .logo-search-container {
    display: flex;
    width: 500px;
    justify-content: space-between;

    > * {
      margin: 0 3%;
    }

    .logo {
      text-decoration: none;
      cursor: pointer;

      > img {
        height: 40px;
        width: auto;
      }
    }

    .search {
      display: flex;
      flex-grow: 1;
      position: relative;

      input {
        width: 100%;
        padding: 0 2%;
        flex-grow: 1;
        border: 1px solid $border-disable;
      }

      .automatic::-webkit-scrollbar {
        display: none;
      }

      .automatic {
        width: 100%;
        height: 300px;
        position: absolute;
        overflow-y: scroll;
        border: 1px solid #d6d6d6;
        top: 47px;
        background: $color-contrast;
        z-index: 500;
        display: none;

        .auto-text {
          font-size: 20px;
          padding: 0 2%;
        }

        .auto-text:hover {
          background: #d6d6d6;
        }

        .selected {
          background: #d6d6d6;
        }
      }
    }
  }

  .nav {
    display: flex;
    width: 55%;
    justify-content: space-evenly;
    align-items: flex-end;

    li {
      list-style-type: none;


      * {
        text-decoration: none;
        border: none;
        background-color: $background-default;
        cursor: pointer;
        color: $color-default;
        font: {
          family: 'Noto Sans KR', sans-serif;
          weight: 400;
          size: 0.9em;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .header {
    overscroll-behavior: contain;
    padding: 0.5em;

    .logo-search-container {
      width: auto;

      .logo {
        > img {
          height: 20px;
        }
      }
    }

    .nav {
      width: 80vw;
      justify-content: flex-end;

      li {
        margin: 0 3px;

        .mobile-button {
          color: $color-primary;
        }
      }
    }



    .top-box {
      min-width: 50vw;
      padding: 1em;

      border-bottom: 0.5px solid rgba(0, 0, 0, 0.6);

      display: flex;
      justify-content: flex-end;
      gap: 25vw;

      .id {
        font-size: 12px;
      }

      button {
        border: none;
        background: none;

        font: {
          family: 'Noto Sans KR', sans-serif;
          size: 12px;
          weight: 300;
        }
      }
    }

    .bottom-box {
      padding: 1em;

      list-style: none;

      display: flex;
      flex-direction: column;
      gap: 1.2em;

      a {
        font-size: 14px;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    > button {
      background: none;
      border: none;
      font-size: 2em;
    }
  }
}
</style>
