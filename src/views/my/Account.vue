<template>
  <div class="account-container">
    <div class="wrapper">
      <identification/>
      <change-email-and-password v-model:email="userInfo.email" :provider="userInfo.provider" />
      <div class="secession-btn" @click="modalState = true">회원탈퇴</div>
    </div>
    <modal v-if="modalState" @close="modalState = false">
      <secession />
    </modal>
  </div>
</template>

<script>
import Identification from '@/components/my/Identification'
import userService from '@/service/user'
import ChangeEmailAndPassword from '@/components/my/ChangeEmailAndPassword.vue'
import Secession from '@/components/my/Secession'
import Modal from '@/components/tool/Modal'
import { errorHandler } from '@/modules/errorHandler'

export default {
  components: { Identification, ChangeEmailAndPassword, Secession, Modal },
  data() {
    return {
      requiredInfo: {
        email: true,
        provider: true
      },
      userInfo: {},
      modalState: false
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      userService
        .getUserInfo(this.requiredInfo)
        .then(({ data }) => {
          this.userInfo = data
        })
        .catch(errorHandler)
    },
    userSecession() {

    }
  },
}
</script>

<style lang="scss" scoped>
.account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;
  .wrapper {
    width: 566px;
    display: flex;
    flex-direction: column;
    gap: 1em;
    .secession-btn{
        margin: 3em auto 0;
        width: 30%;
        text-align: center;
        color: #999999;
        cursor: pointer;
      }
  }
}

@media (max-width: 600px) {
  .account-container {
    padding: 0 2em;
    padding-bottom: 50px;
    font-size: 10px;
    .wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1em;
      
    }
  }
}
</style>
