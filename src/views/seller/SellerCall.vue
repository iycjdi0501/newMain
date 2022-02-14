<template>
  <div class="seller-call">
    <div class="banner">
      <div class="banner-text">
        전화 한통이면 누구나 쉽게<br />부동산을 내놓을 수 있습니다.
      </div>
      <ul>
        <li>
          현재 아파트, 오피스텔 매매 또는 전세만 매물을 내놓을 수 있습니다.
        </li>
        <li>연락처 확인 후 변호사가 직접 연락드리겠습니다.</li>
      </ul>
    </div>
    <div class="step-box">
      <div class="wrapper">
        <div class="step">
          <span class="number">01</span>
          <span class="text">간단한 본인 인증 절차</span>
        </div>
        <div class="step">
          <span class="number">02</span>
          <span class="text">매물 등기부등본과 본인정보 확인</span>
        </div>
        <div class="step">
          <span class="number">03</span>
          <span class="text">에이파트 온라인 매물 등록</span>
        </div>
        <div class="line"></div>
      </div>
    </div>
    <form @submit.prevent="postCallRequest">
      <base-input
        label="성명"
        theme="fixed-4"
        placeholder="성함을 입력해 주세요."
        v-model="form.name"
      />
      <phone
        label="연락처"
        theme="fixed-4"
        placeholder="연락처를 입려해주세요."
        v-model="form.tel"
      />
      <base-input
        label="생년월일"
        theme="fixed-4"
        type="date"
        v-model="form.birth"
        :max="today"
      />
      <input-radio-group
        v-model="form.gender"
        label="성별"
        :options="[
          { label: '남', value: 'male' },
          { label: '여', value: 'female' },
        ]"
        name="gender"
        theme="fixed-4"
      />
      <input-brokerage-detail-address
        :required="false"
        :width="'4em'"
        @building="form.locationInfo.building = String($event)"
        @unit="form.locationInfo.unit = String($event)"
        @coordinate="form.locationInfo.coordinate = $event"
        @jibunAddress="jibunAddress = $event"
        @noneBuilding="noneBuilding = $event"
        @buildingName="form.locationInfo.buildingName = $event"
      />
      <base-checkbox
        v-model="form.collectionOfPersonalInfo"
        label="개인정보 수집 동의"
      />
      <tool-tip class="submit-box" :messages="errorMessages" theme="error">
        <base-button
          type="submit"
          @submit.prevent
          :disabled="!!errorMessages.length"
        >
          집 내놓기 신청
        </base-button>
      </tool-tip>
    </form>
  </div>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import BaseButton from '@/components/form/base/BaseButton'
import InputRadioGroup from '@/components/form/custom/InputRadioGroup'
import Phone from '@/components/form/Phone'
import ToolTip from '@/components/tool/ToolTip'
import { telRegex } from '@/assets/data/regex'
import estate from '@/service/estate'
import { errorHandler } from '@/modules/errorHandler'
import moment from 'moment'
import InputBrokerageDetailAddress from '@/components/form/custom/InputBrokerageDetailAddress'

export default {
  name: 'SellerCall',
  components: {
    ToolTip,
    Phone,
    InputRadioGroup,
    BaseButton,
    BaseCheckbox,
    BaseInput,
    InputBrokerageDetailAddress,
  },
  data() {
    return {
      today: moment().format('YYYY-MM-DD'),
      form: {
        name: '',
        tel: '',
        birth: '',
        gender: '',
        locationInfo: {
          coordinate: {},
          building: null,
        },
        collectionOfPersonalInfo: false,
      },
      jibunAddress: null,
      noneBuilding: false,
    }
  },
  computed: {
    errorMessages() {
      const messages = []

      if (!this.form.name) {
        messages.push('성함을 입력해주세요.')
      }

      if (!telRegex.test(this.form.tel)) {
        messages.push('연락처를 입력해주세요.')
      }

      if (!this.form.birth) {
        messages.push('생년월일을 입력해주세요.')
      }

      if (!this.form.gender) {
        messages.push('성별을 선택해주세요.')
      }

      if (!this.form.locationInfo.building && !this.noneBuilding) {
        messages.push('동 정보가 없다면 없음에 체크해주세요.')
      }

      if (!this.form.locationInfo.unit) {
        messages.push('호수 정보를 입력해주세요.')
      }

      if (
        this.form.locationInfo.building &&
        !(
          this.form.locationInfo.building?.length >= 1 &&
          this.form.locationInfo.building?.length <= 10
        )
      ) {
        messages.push('동 정보를 1자 이상 10자 이하로 입력해주세요.')
      }

      if (
        !(
          this.form.locationInfo.unit?.length >= 1 &&
          this.form.locationInfo.unit?.length <= 10
        )
      ) {
        messages.push('호수 정보를 1자 이상 10자 이하로 입력해주세요.')
      }

      if (!this.form.collectionOfPersonalInfo) {
        messages.push('개인 정보 수집 동의가 필요한 서비스 입니다.')
      }

      return messages
    },
  },
  methods: {
    postCallRequest() {
      if (!this.form.locationInfo.building) {
        delete this.form.locationInfo.building
      }
      if (!this.errorMessages.length) {
        estate
          .postCallRequest(this.form)
          .then(() => {
            this.$store.dispatch('insertNotification', {
              content: '매물 등록 요청되었습니다.',
            })
            this.$router.push({ name: 'SellerMain' })
          })
          .catch(errorHandler)
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 접근입니다.',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.seller-call {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4em;

  .banner {
    width: 100%;
    height: 680px;
    padding: 8em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 40px;

    background: {
      blend-mode: multiply;
      color: $background-filter;
      image: url(../../assets/image/Background_phone.png);
      repeat: no-repeat;
      position: bottom;
      size: cover;
    }

    .banner-text {
      color: $color-contrast;
      line-height: 90px;
      font: {
        size: 3em;
        weight: 500;
      }
    }

    ul {
      list-style-position: inside;
      color: $color-contrast;
      font: {
        size: 1.5em;
        weight: 500;
      }

      li {
        margin: 0.5em 0;
      }
    }
  }

  .step-box {
    width: 100%;
    height: 420px;
    background: $background-disable;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrapper {
      position: relative;
      width: 1080px;
      display: flex;
      justify-content: space-between;

      .step {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-bottom: 3em;
        align-items: center;
        border: 10px solid $border-tertiary;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        background-color: $background-default;
        z-index: 1;

        .number {
          font: {
            size: 3em;
            weight: 500;
          }
        }

        .text {
          width: 80%;
          text-align: center;
          font: {
            size: 1.5em;
            weight: 500;
          }
        }
      }

      .line {
        width: 100%;
        height: 0;
        border-top: 10px solid $border-tertiary;
        position: absolute;
        top: 50%;
      }
    }
  }

  form {
    width: 700px;
    display: flex;
    flex-direction: column;
    gap: 2em;
    margin-bottom: 40px;

    button {
      align-self: center;
      padding: 0.5em 2em;
    }
  }
}

@media (max-width: 1024px) {
  .seller-call {
    gap: 2em;

    .banner {
      height: 200px;
      padding: 1em;
      gap: 1em;

      .banner-text {
        text-align: center;
        line-height: 1.5em;
        font: {
          size: 1.4em;
          weight: 500;
        }
      }

      ul {
        padding: 0 1em;
        font: {
          size: 0.8em;
          weight: 400;
        }
      }
    }

    .step-box {
      width: 100%;
      height: auto;
      background: none;

      .wrapper {
        padding: 2em 0;
        width: auto;
        flex-direction: column;
        gap: 2em;

        .step {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 1em 0 3em;
          align-items: center;
          border: 10px solid $border-tertiary;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background-color: $background-default;
          z-index: 1;

          .number {
            font: {
              size: 2.5em;
              weight: 500;
            }
          }

          .text {
            width: 80%;
            text-align: center;
            font: {
              size: 1.25em;
              weight: 500;
            }
          }
        }

        .line {
          display: none;
        }
      }
    }

    form {
      padding: 1em;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 2em;
      margin-bottom: 40px;

      button {
        align-self: center;
        padding: 0.5em 2em;
      }
    }
  }
}
</style>
