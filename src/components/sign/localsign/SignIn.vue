<template>
  <div class="local-sign-in-container">
    <form @submit.prevent="confirmSignUp(signData)">
      <div class="content">
        <div>아이디</div>
        <input
          type="text"
          v-model="signData.userId"
          placeholder="아이디 입력"
          required
        />
        <div>비밀번호</div>
        <input
          type="password"
          v-model="signData.password"
          placeholder="비밀번호 입력"
          autocomplete="off"
          required
        />
      </div>
      <div class="guide">
        <div class="check">
          <input id="saveId" type="checkbox" v-model="saveId" />
          <label for="saveId">아이디 저장</label>
        </div>
        <div class="sign">
          <div @click="moveNextLink('terms')">회원가입&nbsp;</div>
          |
          <div @click="moveNextLink('pass')">&nbsp;비밀번호 찾기</div>
        </div>
      </div>
      <button class="btn" type="submit">로그인</button>
    </form>
  </div>
</template>
<script>
import localService from '@/service/localLogin'

export default {
  data() {
    return {
      signData: {
        userId: null,
        password: null,
      },
      saveId: null,
    }
  },
  created() {
    this.signData.userId = localStorage.getItem('userId') || null
    this.saveId = localStorage.getItem('userId') ? true : false
  },
  methods: {
    confirmSignUp() {
      localService
        .localSignIn(this.signData)
        .then((res) => {
          if (this.saveId) {
            localStorage.setItem('userId', this.signData.userId)
          } else {
            localStorage.removeItem('userId')
          }

          this.$store.commit('SET_TOKEN', res.data.accessToken)
          this.$emit('signIn')
        })
        .catch((err) => {
          switch (err.response.status) {
            case 404:
            case 401:
              alert('회원정보를 확인해주세요.')
              break
            case 423:
              alert('비활성 계정입니다 고객센터에 문의해주세요.')
              break
            default:
              alert('알 수 없는 오류가 발생하였습니다.')
          }
        })
    },
    moveNextLink(name) {
      this.$emit('close', name)
    },
  },
}
</script>
<style lang="scss" scoped>
.local-sign-in-container {
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  margin-top: 1.6em;
  padding: 30px 0 20px;
  .content {
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
  }
  .guide {
    display: flex;
    justify-content: space-between;
    .check {
      width: 50%;
      display: flex;
      align-items: center;
      #saveId {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
      label {
        font-size: 0.8em;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .sign {
      display: flex;
      font-weight: 500;
      font-size: 0.8em;
      div {
        cursor: pointer;
      }
    }
  }
  .btn {
    width: 100%;
    background: #2c82ff;
    border-radius: 12px;
    padding: 15px;
    border: 0;
    color: $color-contrast;
    font-size: 1.15em;
    margin-top: 40px;
    cursor: pointer;
  }
}
@media (max-width: 1024px) {
  .local-sign-in-container {
    font-size: 14px;
    width: 100%;
    padding: 15px 0 10px;
    .btn {
      font-size: 1.6em;
      margin-top: 15px;
      padding: 10px 0;
    }
  }
}
</style>
