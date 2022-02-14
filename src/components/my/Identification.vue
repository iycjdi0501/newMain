<template>
  <div class="identification-info">
    <h2>본인확인된 정보</h2>
    <div class="info">
      <div class="title">성명</div>
      <div class="description">{{ privacy?.name || '-' }}</div>
    </div>
    <div class="info">
      <div class="title">성별</div>
      <div class="description">
        {{ privacy?.gender || '-' }}
      </div>
    </div>
    <div class="info">
      <div class="title">전화번호</div>
      <div class="description">{{ privacy?.phone || '-' }}</div>
    </div>
    <div class="info">
      <div class="title">생년월일</div>
      <div class="description">
        {{ privacy?.birth || '-' }}
      </div>
    </div>
    <button id="self" @click="certification">
      {{ privacy?.name ? '재인증' : '본인인증' }}
    </button>
  </div>
</template>

<script>
import { v4 as uuidV4 } from 'uuid'
import userService from '@/service/user'
import sign from '@/service/sign'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import imp from '@/modules/imp'

export default {
  data() {
    return {
      privacy: null,
    }
  },
  created() {
    this.getUserPrivacy()
    // eslint-disable-next-line no-undef
    IMP.init(imp.getInitializeKey())
  },
  methods: {
    getUserPrivacy() {
      sign
        .getUserData(['privacy'])
        .then(({ data }) => {
          this.privacy = data.privacy
          if (data.privacy) {
            this.privacy.gender =
              data.privacy.gender === 'male' ? '남성' : '여성'
            this.privacy.birth =
              data.privacy.birth.year +
              '.' +
              data.privacy.birth.month +
              '.' +
              data.privacy.birth.day
          }
        })
        .catch(errorHandler)
    },
    certification() {
      // eslint-disable-next-line no-undef
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
.identification-info {
  padding: 15px 30px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  position: relative;

  h2 {
    padding-bottom: 2%;
    margin-bottom: 2%;
  }

  .info {
    display: flex;
    font-size: 1.15em;
    margin-bottom: 5px;

    .title {
      width: 42%;
      font-weight: 500;
    }

    .description {
      font-size: 1em;
      font-weight: 400;
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

#self {
  position: absolute;
  top: 0;
  right: 22px;
}
</style>
