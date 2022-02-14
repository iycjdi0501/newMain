<template>
  <div class="terms-container">
    <div class="sign-up">
      <div class="title">회원가입</div>
      <div class="content">
        <div class="terms">
          <div class="check">
            <input type="checkbox" v-model="age" />
            <div><span>[필수]</span>만 14세 이상입니다.</div>
          </div>
        </div>
        <div class="terms">
          <div class="check">
            <input type="checkbox" v-model="service" />
            <div><span>[필수]</span>서비스 이용약관</div>
          </div>
          <a class="read-terms" :href="`/policy/`" target="_blank">보기</a>
        </div>
        <div class="terms">
          <div class="check">
            <input type="checkbox" v-model="info" />
            <div><span>[필수]</span>개인정보 처리방침</div>
          </div>
          <a class="read-terms" :href="`/policy/privacy-policy`" target="_blank">보기</a>
        </div>
        <div class="terms">
          <div class="check">
            <input type="checkbox" v-model="marketing" />
            <div><span>[선택]</span>마케팅 정보수신에 대한 동의</div>
          </div>
          <a class="read-terms" :href="`/policy/marketing`" target="_blank">보기</a>
        </div>
      </div>
      <div class="all-select">
        <input type="checkbox" @click="allAccept($event.target.checked)" />
        <div class="select">모두 동의합니다.</div>
      </div>
      <button
        class="btn"
        type="button"
        @click="$emit('close', {step: `signup`, marketing: marketing, policy: age && service && info})"
        :disabled="!age || !service || !info"
      >
        동의하고 진행
      </button>
    </div>
    <div class="use" v-if="step === 'use'">
      <terms-of-use />
    </div>
  </div>
</template>
<script>
import TermsOfUse from '@/views/policy/TermsOfUse'
export default {
  components: { TermsOfUse },
  data() {
    return {
      age: false,
      service: false,
      info: false,
      marketing: false,
    }
  },
  methods: {
    allAccept(check) {
      if (check) {
        this.age = this.service = this.info = this.marketing = true
      } else {
        this.age = this.service = this.info = this.marketing = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.terms-container {
  padding: 2.5em 3.75em;
  width: 500px;
  height: 41em;
  .sign-up {
    .title {
      font-size: 2.25em;
      font-weight: bold;
      margin-bottom: 0.7em;
    }
    .content {
      border: 0.5px solid rgba(0, 0, 0, 0.5);
      border-width: 0.5px 0;
      padding: 0.25em 0.2em 0.5em;
      .terms {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
        .check {
          display: flex;
          align-items: center;
          font-size: 0.9em;
          span {
            margin: 0 5px 0 10px;
            color: #ff0000;
            font-weight: 400;
          }
        }
        .read-terms {
          font-weight: 500;
          color: #000;
          cursor: pointer;
        }
      }
    }
    .all-select {
      display: flex;
      padding: 1.5em 0.2em;
      align-items: center;
      .select {
        margin-left: 10px;
        font-weight: bold;
        font-size: 0.9em;
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
  .use {
    width: 23em;
    height: 41em;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .use::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
@media (max-width: 1024px){
  button{
    width: 250px !important;
  }
}
</style>
