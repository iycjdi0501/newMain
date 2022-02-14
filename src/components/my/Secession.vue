<template>
  <div class="secession-container">
    <div class="header">회원탈퇴</div>
    <div class="guide">회원탈퇴를 신청하기전 한번 더 확인해주세요.</div>
    <div class="guide-text">1. 현재 로그인된 아이디는 즉시 탈퇴처리됩니다.</div>
    <div class="guide-text">
      2. 로그인이 필요한 모든 서비스 이용이 불가능합니다.
    </div>
    <div class="guide-text">
      3. 회원님이 등록하신 모든 매물과 상담은 삭제됩니다.
    </div>
    <div class="guide-text">4. 탈퇴한 계정은 복구가 불가능합니다.</div>
    <form @submit.prevent="secession">
      <div class="guide-check">
        <input type="checkbox" v-model="isAccept" />
        <label>안내사항을 모두 확인하였으며, 이에 동의합니다.</label>
      </div>
      <button class="confirm" :disabled="!isAccept">탈퇴 완료</button>
    </form>
  </div>
</template>
<script>
import userService from '@/service/user'
export default {
  data() {
    return {
      isAccept: false,
    }
  },
  methods: {
    secession() {
      if (this.isAccept) {
        userService
          .userSecession()
          .then(() => {
            this.$store.commit('REMOVE_TOKEN')
            this.$store.dispatch('insertNotification', {
              content:
                '더 노력하는 A-part가 되겠습니다. 지금까지 이용해주셔서 감사합니다.',
              time: 5,
            })
          })
          .catch({})
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 접근입니다.',
          time: 5,
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.secession-container {
  width: 560px;
  height: auto;
  padding: 1em 2em 2em;
  font-weight: 400;
  .header {
    font-size: 2em;
    padding-bottom: 0.5em;
    color: #000000;
    font-weight: 500;
    margin-top: 0.5em;
    border-bottom: 1px solid #000;
  }
  .guide {
    color: $color-primary;
    font-weight: 700;
    font-size: 1.2em;
    margin: 1em 0;
  }
  .guide-text {
    margin-bottom: 5px;
    color: #666666;
  }
  .confirm {
    display: block;
    width: 100%;
    height: 2.5em;
    font-size: 1.2em;
    background: $color-primary;
    border: 0;
    color: $color-contrast;
    font-weight: 700;
    cursor: pointer;
  }
  .confirm:disabled {
    background: #ccc;
  }
  .guide-check {
    margin: 1em 0 1em;
    padding-top: 1em;
    border-top: 1px solid #000;
    display: flex;
    align-items: center;
    font-size: 1.2em;
    input {
      width: 20px;
      height: 20px;
      margin-right: 0.5em;
    }
  }
}
</style>
