<template>
  <modal
    class="modal"
    :theme="'sign-in'"
    :closebtn="close"
    @close="$emit('close:signIn')"
  >
    <div class="sign-in" v-if="step === null">
      <img src="@/assets/logo/svg/Logo_Text-en_Column.svg" alt="A-part logo" />
      <local-sign-in @close="step = $event" @signIn="$emit('close:signIn')" />
      <transition name="fade" mode="out-in">
        <spinner class="spinner" v-if="loading" :complete="!loading" />
        <kakao v-else />
      </transition>

      <ul>
        <li>
          <router-link
            @click="$emit('close:signIn')"
            :to="{ name: 'TermsOfUse' }"
          >
            이용약관
          </router-link>
        </li>
        |
        <li>
          <router-link
            @click="$emit('close:signIn')"
            :to="{ name: 'PrivacyPolicy' }"
          >
            개인정보처리방침
          </router-link>
        </li>
      </ul>
    </div>
    <terms
      class="sign"
      v-if="step === 'terms'"
      @close="
        ;(step = $event.step),
          (marketing = $event.marketing),
          (policy = $event.policy)
      "
    />
    <sign-up
      class="sign"
      v-if="step === 'signup'"
      :marketing="marketing"
      :policy="policy"
      @close="step = null"
    />
    <password-Find
      class="sign"
      v-if="step === 'pass'"
      @close="$emit('close:signIn')"
    />
  </modal>
</template>

<script>
import Kakao from '@/components/sign/social/Kakao'
import Spinner from '@/components/tool/Spinner'
import { mapState } from 'vuex'
import Modal from '@/components/tool/Modal'
import LocalSignIn from '@/components/sign/localsign/SignIn'
import Terms from '@/components/sign/localsign/Terms'
import SignUp from '@/components/sign/localsign/SignUp'
import PasswordFind from '@/components/sign/localsign/PasswordFind'
export default {
  components: {
    Modal,
    Spinner,
    Kakao,
    LocalSignIn,
    Terms,
    SignUp,
    PasswordFind,
  },
  computed: {
    ...mapState({
      loading: (state) => state.sign.loading,
    }),
  },
  data() {
    return {
      step: null,
      close: true,
      marketing: false,
      policy: false,
    }
  },
  methods: {
    changeStep(step) {
      if (step === 'use') {
        this.close = false
      }
      this.step = step
    },
  },
}
</script>

<style lang="scss" scoped>
.sign {
  margin: 1em 0 1px;
}

.sign-in {
  width: 29em;
  height: 41em;
  padding: 2em 2em 0;
  margin: 1em 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  .spinner {
    align-self: center;
    flex-shrink: 0;
  }

  img {
    width: 7.5em;
    height: auto;
    align-self: center;
  }

  ul {
    align-self: center;
    list-style-type: none;
    display: flex;
    gap: 1em;
    color: $color-disable;
    font: {
      size: 0.8125em;
    }
    margin-top: 3em;

    a {
      color: $color-disable;
      text-decoration: none;
    }
  }
}

@media (max-width: 1024px) {
  .sign {
    font-size: 13px;
    width: 100%;
  }
  .sign-in {
    width: 90%;
    max-width: 450px;
    padding: 5% 2% 2em;
    justify-content: start;
    height: 33em;
    img {
      width: 30%;
    }
  }
  .kakao {
    width: 100%;
  }
}
</style>
