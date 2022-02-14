<template>
  <div class="change-container">
    <div class="card-view">
      <h2 class="identification-title">이메일 변경</h2>
      <div class="input-field">
        <div>이메일</div>
        <input
          type="text"
          ref="email"
          :value="email"
          @input="$emit('update:email', $event.target.value)"
        />
      </div>
      <button @click="modifyUserInfo({ email: email })">변경</button>
    </div>
    <div class="card-view" v-if="provider === 'local'">
      <h2 class="identification-title">비밀번호 변경</h2>
      <form @submit.prevent="checkPassword(password)">
        <div class="input-field">
          <div>이전 비밀번호</div>
          <input type="password" v-model="password.currentPassword" autocomplete="off" />
        </div>
        <div class="input-field">
          <div>비밀번호</div>
          <input type="password" v-model="password.password" autocomplete="off"/>
        </div>
        <div class="input-field">
          <div>비밀번호 재확인</div>
          <input type="password" v-model="reconfirmPassword" autocomplete="off"/>
        </div>
        <button>변경</button>
      </form>
    </div>
  </div>
  <modal v-if="modalState" @close="modalState = false">
    <div class="message">
      {{ message }}
      <div class="close" @click="modalState = false">닫기</div>
    </div>
  </modal>
</template>

<script>
import Identification from '@/components/my/Identification'
import userService from '@/service/user'
import Modal from '@/components/tool/Modal'

export default {
  components: { Identification, Modal },
  props: {
    email: {
      type: String,
    },
    provider: {
      type: String,
    }
  },
  data() {
    return {
      password: {
        currentPassword: null,
        password: null,
      },
      modalState: false,
      message: '',
      reconfirmPassword: null,
    }
  },
  methods: {
    modifyUserInfo(data) {
      userService
        .modifyUserInfo(data)
        .then(() => {
          this.message = '정보가 변경되었습니다'
          this.modalState = true
          if(data.password){
            this.password.currentPassword = ''
            this.password.password = ''
            this.reconfirmPassword = ''
          }
        })
        .catch((err) => {
          switch (err.response.status) {
            case 400:
              this.message = '요청 데이터가 잘못되었습니다.'
              break
            case 401:
              this.message = '로그인이 필요합니다.'
              break
            case 404:
              this.message = '일치하는 유저를 찾을 수 없습니다.'
              break
            case 405:
              this.message = '현재 비밀번호가 일치하지않습니다.'
              break
            case 423:
              this.message = '영구정지된 유저입니다.\n고객센터에 문의해주세요.'
              break
            case 480:
              this.message = '중복된 이메일입니다.'
              break
            default:
              this.message = '알 수 없는 오류입니다.'
          }
          this.modalState = true
        })
    },
    checkPassword(password) {
      if (password.password === this.reconfirmPassword) {
        let err
        let regex

        if (!this.password && !this.reconfirmPassword) {
          alert('잘못된 접근입니다.')
          return false
        }

        regex =
          /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$|^(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.*[A-Za-z])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$|^(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.*\d)[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,16}$/
        if (!regex.test(password.password)) {
          err =
            '비밀번호는 8~16자, 영문, 숫자, 특수문자중 2개이상의 조합을 포함해주세요.'
        }
        if (err) {
          this.message = err
          this.modalState = true
        } else {
          this.modifyUserInfo(password)
        }
      } else {
        this.message = '비밀번호 재확인이 일치하지않습니다.'
        this.modalState = true
      }
    },
  },
}
</script>

StringInput
<style lang="scss" scoped>
.card-view {
  padding: 15px 30px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  position: relative;
  .identification-title {
    margin: 2% 0;
  }
  .input-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.15em;
    div {
      font-weight: 500;
    }
    input {
      width: 300px;
      padding: 10px 2%;
      border: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      font-size: 1em;
    }
  }
}

button {
  display: block;
  width: 20%;
  margin-left: 80%;
  border-radius: 12px;
  padding: 5px 0;
  background: $color-primary;
  color: $color-contrast;
  font-weight: bold;
  border: 0;
  font-size: 1em;
  margin-top: 1em;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  position: absolute;
  top: 9px;
  right: 22px;
}
.message {
  margin: 2em 4em;
  font-size: 1.5em;
  font-weight: 500;
  .close {
    font-size: 0.8em;
    width: 6em;
    padding: 0.5em 1.3em;
    text-align: center;
    border: 1px solid #000;
    margin: 0 auto;
    border-radius: 14px;
    margin-top: 1.5em;
  }
}

@media (max-width: 600px) {
  .input-field {
    input {
      width: 58% !important;
      padding: 10px 2%;
      border: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      font-size: 1em;
    }
  }
}
</style>
