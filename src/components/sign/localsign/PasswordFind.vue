<template>
  <div class="password-reset-container">
    <div class="title">비밀번호 찾기</div>
    <form @submit.prevent="confirmEmail()">
      <div class="content">
        <div>이메일 주소</div>
        <input
          type="email"
          v-model="email"
          placeholder="이메일 주소를 입력해주세요."
          maxlength="50"
          required
        />
        <ul>
          <li class="guide">
            입력하신 이메일 주소로 비밀번호를 재설정 할 수 있는 URL링크를
            보내드립니다.
          </li>
        </ul>
      </div>
      <button class="btn" type="submit" :disabled="!email">메일 전송</button>
    </form>
  </div>
</template>
<script>
import localSignService from '@/service/localLogin'
export default {
  data() {
    return {
      email: null,
    }
  },
  methods: {
    confirmEmail() {
      let err
      let regex

      regex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (!regex.test(this.email)) {
        err = '이메일을 확인해주세요.'
      }

      if (err) {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '이메일 형식을 확인해주세요.',
          time: 3,
        })
      } else {
        this.findPassword()
      }
    },
    findPassword() {
      localSignService
        .sendEmail({ email: this.email })
        .then(() => {
          this.$store.dispatch('insertNotification', {
            content: '이메일이 전송되었습니다. \n메일을 확인해주세요.',
            time: 3,
          })
          this.$emit('close')
        })
        .catch((err) => {
          if (err.response.status === 405) {
            this.$store.dispatch('insertNotification', {
              type: 'error',
              content: '카카오 계정입니다. 카카오로 소셜로그인 해주세요.',
              time: 3,
            })
          }
          this.$store.dispatch('insertNotification', {
            type: 'error',
            content: '이메일 형식을 확인해주세요.',
            time: 3,
          })
        })
      // this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.password-reset-container {
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
    ul > li {
      margin-left: 1em;
      font-size: 0.75em;
      font-weight: 500;
      color: #000;
      word-break: keep-all;
      word-wrap: break-word;
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
    margin-top: 3em;
  }
  .btn:disabled {
    background: #ccc;
  }
}
@media (max-width: 1024px) {
  .btn {
    width: 100% !important;
    margin-top: 30px !important;
  }
}
</style>
