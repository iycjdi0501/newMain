<template>
  <div class="local-sign-up-container">
    <div class="title">회원가입</div>
    <form @submit.prevent="confirmSignUp(signData, repassword)">
      <div class="content">
        <div><span>*</span> 아이디</div>
        <input
          type="text"
          v-model="signData.userId"
          placeholder="아이디 입력"
          maxlength="50"
          required
        />
        <div><span>*</span> 비밀번호</div>
        <input
          id="input-password"
          type="password"
          v-model="signData.password"
          placeholder="8자리 이상 16자 이하, 영문, 숫자, 특수문자 포함"
          maxlength="16"
          required
        />
        <input
          type="password"
          v-model="repassword"
          placeholder="비밀번호 재확인"
          maxlength="16"
          required
        />
        <div><span>*</span> 이메일 주소</div>
        <input
          type="text"
          v-model="signData.email"
          placeholder="이메일주소 입력"
          required
        />
      </div>
      <button
        class="btn smaRtLog_BTN"
        type="submit"
        :disabled="
          !signData.userId ||
          !signData.password ||
          !signData.email ||
          !repassword
        "
      >
        회원가입
      </button>
    </form>
  </div>
</template>
<script>
import localSignService from '@/service/localLogin'
export default {
  props: {
    policy: {
      type: Boolean,
      default: false,
    },
    marketing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      signData: {
        userId: null,
        password: null,
        email: null,
      },
      repassword: null,
    }
  },
  methods: {
    confirmSignUp(user, repassword) {
      let err
      let regex

      if (!user.userId && !user.password && !user.email && !repassword) {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 접근입니다.',
          time: 3,
        })
        return false
      }

      regex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (!regex.test(user.email)) {
        err = '이메일을 확인해주세요.'
      }

      if (user.password !== repassword) {
        err = '비밀번호가 일치하지 않습니다.'
      }

      regex =
        /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$|^(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.*[A-Za-z])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$|^(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.*\d)[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$/
      if (!regex.test(user.password)) {
        err =
          '비밀번호는 8~16자, 영문, 숫자, 특수문자 중 2개이상을 조합해주세요.'
      }

      regex = /^[A-Za-z0-9_-]{5,50}$/
      if (!regex.test(user.userId)) {
        err = '아이디를 확인해 주세요.'
      }

      if (err) {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: err,
          time: 3,
        })
        return false
      } else {
        this.signUp(user)
        return true
      }
    },
    signUp(user) {
      let userData = user
      userData.agreement = {
        marketingReceive: this.marketing,
        termsOfService: this.policy,
        privacyPolicy: this.policy,
        ageOver14: this.policy,
      }
      localSignService
        .localSignUp(user)
        .then(() => {
          this.$store.dispatch('insertNotification', {
            content: '회원가입이 완료되었습니다.',
            time: 3,
          })
          this.$emit('close')
        })
        .catch((err) => {
          switch (err.response.status) {
            case 480:
              this.$store.dispatch('insertNotification', {
                type: 'error',
                content:
                  '이미 회원으로 등록되어있는 이메일입니다.\n로그인 또는 비밀번호찾기를 이용해주세요.',
                time: 3,
              })
              this.$emit('close')
              return
          }
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.local-sign-up-container {
  padding: 2.5em 3.75em;
  width: 500px;
  height: 41em;

  .title {
    font-size: 2.25em;
    font-weight: bold;
    margin-bottom: 0.7em;
  }
  .content {
    border-top: 0.5px solid rgba(0, 0, 0, 0.5);

    padding: 2em 0.2em 0;
    div {
      font-size: 1.15em;
      font-weight: 500;
      margin-bottom: 10px;
      span {
        color: #ff0000;
      }
    }
    input {
      width: 100%;
      font-size: 1.1em;
      padding: 0 4%;
      margin-bottom: 20px;
      font-weight: bold;
      border-radius: 5px;
      line-height: 40px;
      border: 1px solid rgba(0, 0, 0, 0.6);
    }
    #input-password {
      margin-bottom: 10px;
    }
  }
  .btn {
    width: 380px;
    height: 55px;
    background: #2c82ff;
    border-radius: 10px;
    border: 0;
    color: $color-contrast;
    font-size: 1.15em;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1.5em;
  }
  .btn:disabled {
    background: #ccc;
  }
}
@media (max-width: 1024px) {
  .content {
    padding: 1em 0.2em 0 !important;
  }
  .btn {
    width: 100% !important;
    margin-top: 10px !important;
  }
}
</style>
