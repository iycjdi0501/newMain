<template>
  <modal class="modal" @close="$emit('close:identify')">
    <div class="identification">
      <img src="@/assets/logo/svg/Logo_Text-en_Column.svg" alt="A-part logo" />
      <p>해당 서비스를 이용하기 위해서<br />본인인증이 필요합니다.</p>
      <button @click="certification">본인인증</button>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/tool/Modal'
import imp from '@/modules/imp'
import { v4 as uuidV4 } from 'uuid'
import userService from '@/service/user'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'

export default {
  name: 'IdentificationModal',
  components: { Modal },
  created() {
    IMP.init(imp.getInitializeKey())
  },
  methods: {
    certification() {
      IMP.certification(
        {
          merchant_uid: uuidV4(),
          popup: false,
          m_redirect_url: imp.getRedirectUri(),
        },
        (res) => {
          if (res.success) {
            const { imp_uid } = res

            userService
              .checkPhoneVerification({ imp_uid })
              .then(() => {
                this.$store.dispatch('insertNotification', {
                  content: '본인인증 되었습니다.',
                })
                this.$store.commit('CLOSE_IDENTIFY_MODAL')
                this.getUserPrivacy()
              })
              .catch((error) => errorHandler(error, ERROR_TYPE.VERIFICATION))
          } else {
            this.$store.dispatch('insertNotification', {
              type: 'error',
              content: `${res.error_msg}`,
            })
            this.$store.commit('CLOSE_IDENTIFY_MODAL')
            this.$router.push({ name: 'Account' })
          }
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.identification {
  padding: 2em 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;

  img {
    width: 30%;
  }

  p {
    text-align: center;

    font: {
      size: 1em;
      weight: 500;
    }
  }

  button {
    align-self: stretch;

    padding: 1em;

    background-color: $background-primary;
    color: $color-contrast;
    border: none;

    cursor: pointer;

    font: {
      size: 1em;
      weight: 500;
    }
  }

  .content {
    align-self: stretch;
    font: {
      size: 0.9em;
    }
  }
}
</style>
