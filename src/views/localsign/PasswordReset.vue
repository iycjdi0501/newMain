<template>
  <div class="password-reset-container">
    <form @submit.prevent="checkPassword()">
      <div class="content">
        <div class="title">비밀번호 재설정</div>
        <div class="item">
          <div>비밀번호</div>
          <input
            id="input-password"
            type="password"
            placeholder="8자리 이상 16자 이하, 영문, 숫자, 특수문자 포함"
            maxlength="16"
            v-model="password"
            autocomplete="off"
            required
          />
          <input
            type="password"
            placeholder="비밀번호 재확인"
            maxlength="16"
            autocomplete="off"
            v-model="reconfirmPassword"
            required
          />
        </div>
        <button class="btn" type="submit" :disabled="!password || !reconfirmPassword">
          비밀번호 변경
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import localService from '@/service/localLogin'
export default {
  data() {
    return {
      password: null,
      reconfirmPassword: null,
    }
  },
  methods: {
    checkPassword() {
      let err
      let regex

      if (!this.password && !this.reconfirmPassword) {
        alert('잘못된 접근입니다.')
        return false
      }

      if (this.password !== this.reconfirmPassword) {
        err = '비밀번호가 일치하지 않습니다.'
      }

      regex =
        /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$|^(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.*[A-Za-z])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$|^(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.*\d)[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$/
      if (!regex.test(this.password)) {
        err = '비밀번호는 8~16자, 영문, 숫자, 특수문자 2개이상을 포함해주세요.'
      }
      if (err) {
        alert(err)
        return false
      } else {
        this.changePassword()
        return true
      }
    },
    changePassword() {
      localService
        .passwordReset({
          password: this.password,
          token: this.$route.query.token,
        })
        .then(() => {
          alert('비밀번호가 정상적으로 변경되었습니다.')
          this.$router.push({ path: '/' })
        })
        .catch((err) => {
          switch (err.response.status) {
            case 400:
              alert('비밀번호를 확인해주시기 바랍니다.')
              break
            case 401:
              alert('유효하지않은 토큰입니다.\n메일을 다시 요청해주세요.')
              break
            case 404:
              alert('해당아이디로 가입된 계정이 없습니다.')
              break
            default:
              alert('알 수 없는 오류가 발생하였습니다.')
          }
          if (err.response.status !== 400) {
            this.$router.push({ path: '/' })
          }
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.password-reset-container {
  padding: 5em;
  background-color: $background-foundation;
  display: flex;
  justify-content: center;
  .content {
    padding: 2.5em 3.75em;
    width: 500px;
    height: 41em;
    background: $color-contrast;
    .title {
      font-size: 2.25em;
      font-weight: bold;
      margin-bottom: 0.7em;
    }
    .item {
      border-top: 0.5px solid rgba(0, 0, 0, 0.5);

      padding: 2em 0.2em 0;
      div {
        font-size: 1.15em;
        font-weight: 500;
        margin-bottom: 10px;
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
}
@media (max-width: 1024px) {
  .password-reset-container {
    padding: 5em 0;
    height: 94vh;
    .content {
      width: 100% !important;
      height: 100%;
      padding: 2.5em 2em;
      .item > input::placeholder{
        font-size: 12px;
      }
      .btn {
        width: 300px;
      }
    }
  }
}
</style>
