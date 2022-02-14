<template>
  <div class="brokerage">
    <div class="banner">
      <div class="banner-text">
        에이파트에 없는 매물도<br />변호사 중개서비스 이용이 가능합니다.
      </div>
      <ul>
        <li>특약사항은 변호사의 중개하에 작성하시면 됩니다.</li>
        <li>중개 희망일은 매도인과 구체적으로 정하시면 좋습니다.</li>
      </ul>
    </div>
    <form @submit.prevent="submitBrokerageRequest">
      <h3>부동산 매매 중개 요청</h3>
      <fieldset>
        <base-input
          v-if="!realEstateId"
          v-model="form.sellerName"
          label="매도인 성명"
          theme="fixed-8"
          required
        />
        <phone
          v-if="!realEstateId"
          v-model="form.sellerPhone"
          label="매도인 연락처"
          theme="fixed-8"
          required
        />
        <base-input
          v-model="form.buyerName"
          label="매수인 성명"
          theme="fixed-8"
          required
        />
        <phone
          v-model="form.buyerPhone"
          label="매수인 연락처"
          theme="fixed-8"
          required
        />
        <input-brokerage-detail-address
          :width="isMobile ? '6em' : '8em'"
          @building="form.locationInfo.building = String($event)"
          @unit="form.locationInfo.unit = String($event)"
          @coordinate="form.locationInfo.coordinate = $event"
          @jibunAddress="jibunAddress = $event"
          @noneBuilding="noneBuilding = $event"
          @buildingName="form.locationInfo.buildingName = $event"
        />
      </fieldset>
      <fieldset>
        <base-input
          v-model="form.desiredDate"
          label="중개 희망일"
          theme="fixed-8"
          type="date"
          :min="today"
          :max="
            form.downPaymentInfo.date ||
            form.interimPaymentInfos[0]?.date ||
            form.interimPaymentInfos[1]?.date ||
            form.interimPaymentInfos[2]?.date ||
            form.balanceInfo.date
          "
        />
        <price-date
          label="계약금"
          theme="fixed-8"
          v-model:price="form.downPaymentInfo.price"
          v-model:date="form.downPaymentInfo.date"
          :min="form.desiredDate || today"
          :max="
            form.interimPaymentInfos[0]?.date ||
            form.interimPaymentInfos[1]?.date ||
            form.interimPaymentInfos[2]?.date ||
            form.balanceInfo.date
          "
        />
        <transition-group name="fade">
          <price-date
            v-if="form.interimPaymentInfos.length > 0"
            label="중도금 1차"
            theme="fixed-8"
            v-model:price="form.interimPaymentInfos[0].price"
            v-model:date="form.interimPaymentInfos[0].date"
            :min="form.downPaymentInfo.date || form.desiredDate || today"
            :max="
              form.interimPaymentInfos[1]?.date ||
              form.interimPaymentInfos[2]?.date ||
              form.balanceInfo.date
            "
          />
          <price-date
            v-if="form.interimPaymentInfos.length > 1"
            label="중도금 2차"
            theme="fixed-8"
            v-model:price="form.interimPaymentInfos[1].price"
            v-model:date="form.interimPaymentInfos[1].date"
            :min="
              form.interimPaymentInfos[0]?.date ||
              form.downPaymentInfo.date ||
              form.desiredDate ||
              today
            "
            :max="form.interimPaymentInfos[2]?.date || form.balanceInfo.date"
          />
          <price-date
            v-if="form.interimPaymentInfos.length > 2"
            label="중도금 3차"
            theme="fixed-8"
            v-model:price="form.interimPaymentInfos[2].price"
            v-model:date="form.interimPaymentInfos[2].date"
            :min="
              form.interimPaymentInfos[1]?.date ||
              form.interimPaymentInfos[0]?.date ||
              form.downPaymentInfo.date ||
              form.desiredDate ||
              today
            "
            :max="form.balanceInfo.date"
          />
        </transition-group>
        <price-date
          label="잔금"
          theme="fixed-8"
          v-model:price="form.balanceInfo.price"
          v-model:date="form.balanceInfo.date"
          :min="
            form.interimPaymentInfos[2]?.date ||
            form.interimPaymentInfos[1]?.date ||
            form.interimPaymentInfos[0]?.date ||
            form.downPaymentInfo.date ||
            form.desiredDate ||
            today
          "
        />
        <ul>
          <li>
            계약금, 중도금, 잔금은 필수사항이 아닙니다. 변호사 중개 하에
            정하셔도 됩니다.
          </li>
        </ul>
        <div class="interim-box">
          <font-awesome-icon
            class="plus"
            @click="form.interimPaymentInfos.push({ price: '', date: '' })"
            v-if="form.interimPaymentInfos.length < 3"
            :icon="['far', 'plus']"
          />
          <font-awesome-icon
            class="minus"
            @click="form.interimPaymentInfos.pop()"
            v-if="form.interimPaymentInfos.length > 1"
            :icon="['far', 'minus']"
          />
        </div>
      </fieldset>
      <base-checkbox
        v-model="agreement"
        label="에이파트에 중개 의뢰하시기로 매도인(임대인)과 매수인(임차인) 상호 협의 하셨나요?"
      />
      <tool-tip class="submit-box" :messages="errorMessages" theme="error">
        <base-button
          type="submit"
          @submit.prevent
          :disabled="!!errorMessages.length"
        >
          중개 요청하기
        </base-button>
      </tool-tip>
    </form>
  </div>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'
import Phone from '@/components/form/Phone'
import ToolTip from '@/components/tool/ToolTip'
import BaseButton from '@/components/form/base/BaseButton'
import PriceDate from '@/components/form/PriceDate'
import estate from '@/service/estate'
import { removeUndefined } from '@/modules/tools'
import { telRegex } from '@/assets/data/regex'
import { errorHandler } from '@/modules/errorHandler'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import InputBrokerageDetailAddress from '@/components/form/custom/InputBrokerageDetailAddress'
export default {
  name: 'Brokerage',
  props: {
    realEstateId: {
      type: String,
    },
  },
  components: {
    BaseCheckbox,
    PriceDate,
    BaseButton,
    ToolTip,
    Phone,
    BaseInput,
    InputBrokerageDetailAddress
  },
  data() {
    return {
      today: moment().format('YYYY-MM-DD'),
      agreement: false,
      form: {
        buyerName: '',
        buyerPhone: '',
        sellerName: '',
        sellerPhone: '',
        desiredDate: '',
        locationInfo: {
          coordinate: {},
          building: null,
        },
        realEstateId: this.realEstateId,
        downPaymentInfo: {
          price: '',
          date: '',
        },
        interimPaymentInfos: [
          {
            price: '',
            date: '',
          },
        ],
        balanceInfo: {
          price: '',
          date: '',
        },
      },
      jibunAddress: null,
      noneBuilding: false
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
    errorMessages() {
      const messages = []

      if (!this.agreement) {
        messages.push('협의 여부를 체크해 주세요.')
      }

      if (!this.form.buyerName) {
        messages.push('매수인 성함을 입력해 주세요.')
      }

      if (!(this.form.buyerPhone && telRegex.test(this.form.buyerPhone))) {
        messages.push('매수인 연락처를 입력해 주세요.')
      }

      if (!this.form.realEstateId) {
        if (!this.form.sellerName) {
          messages.push('매도인 성함을 입력해 주세요.')
        }
        if (!(this.form.sellerPhone && telRegex.test(this.form.sellerPhone))) {
          messages.push('매도인 연락처를 입력해 주세요.')
        }
      }
      if (!this.form.locationInfo.building && !this.noneBuilding) {
        messages.push('동 정보가 없다면 없음에 체크해주세요.')
      }

      if (!this.form.locationInfo.unit) {
        messages.push('호수 정보를 입력해주세요.')
      }

      if (
        this.form.locationInfo.building &&
        !(this.form.locationInfo.building?.length >= 1 && this.form.locationInfo.building?.length <= 10)
      ) {
        messages.push('동 정보를 1자 이상 10자 이하로 입력해주세요.')
      }

      if (!(this.form.locationInfo.unit?.length >= 1 && this.form.locationInfo.unit?.length <= 10)) {
        messages.push('호수 정보를 1자 이상 10자 이하로 입력해주세요.')
      }
      if (
        !this.form.downPaymentInfo.price !== !this.form.downPaymentInfo.date
      ) {
        messages.push('계약금 정보를 모두 입력해 주세요.')
      }

      this.form.interimPaymentInfos.forEach((object, index) => {
        if (!object.price !== !object.date) {
          messages.push(`중도금 ${index + 1}차 정보를 모두 입력해 주세요.`)
        }

        for (const [
          prevIndex,
          prevObject,
        ] of this.form.interimPaymentInfos.entries()) {
          if (index === prevIndex) break

          if (!(prevObject.price && prevObject.date)) {
            if (
              !messages.includes(
                `중도금 ${prevIndex + 1}차 정보를 모두 입력해 주세요.`
              )
            ) {
              messages.push(
                `중도금 ${prevIndex + 1}차 정보를 모두 입력해 주세요.`
              )
            }
          }
        }
      })

      if (!this.form.balanceInfo.price !== !this.form.balanceInfo.date) {
        messages.push('잔금 정보를 모두 입력해 주세요.')
      }

      return messages
    },
  },
  methods: {
    submitBrokerageRequest() {
      const data = removeUndefined(this.form)
      if(!this.form.locationInfo.building){
        delete this.form.locationInfo.building
      }
      estate
        .postBrokerageRequest(data)
        .then(() => {
          this.$store.dispatch('insertNotification', {
            content: '중개가 요청되었습니다.',
          })
          if (this.form.realEstateId) {
            this.$router.push({
              name: 'EstateDetail',
              params: { id: this.form.realEstateId },
            })
          } else {
            this.$router.push({ name: 'Main' })
          }
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" scoped>

.brokerage {
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

  form {
    width: 700px;
    display: flex;
    flex-direction: column;
    gap: 2em;
    margin-bottom: 40px;

    h3 {
      font: {
        size: 3em;
        weight: 700;
      }
    }

    fieldset {
      position: relative;
      padding: 2em 0;
      display: flex;
      flex-direction: column;
      gap: 1em;
      border: none;
      border-top: 1px solid $border-disable;

      &:nth-child(3) {
        margin-top: -2em;
      }

      ul {
        list-style-position: inside;

        li {
          font: {
            size: 0.75em;
          }
        }
      }
      

      .interim-box {
        display: flex;
        gap: 1em;
        position: absolute;
        left: 720px;
        bottom: 134px;

        svg {
          cursor: pointer;
          font-size: 1.5em;

          &.plus {
            color: $color-point-green;
          }

          &.minus {
            color: $color-point-pink;
          }
        }
      }
    }

    button {
      align-self: center;
      padding: 0.5em 2em;
    }
  }
}

@media (max-width: 1024px) {
  .brokerage {
    gap: 2em;

    .banner {
      height: 200px;
      padding: 1em;
      gap: 1em;

      .banner-text {
        line-height: normal;
        font: {
          size: 1em;
        }
      }

      ul {
        color: $color-contrast;
        font: {
          size: 0.7em;
          weight: 400;
        }
      }
    }

    form {
      width: 100vw;
      padding: 0 1em;
      gap: 2em;
      margin-bottom: 3em;

      h3 {
        font: {
          size: 1.25em;
        }
      }

      fieldset {
        padding: 1em 0;
        gap: 1em;
        font-size: 0.9em;

        .interim-box {
          left: 80px;
          bottom: 163px;
          gap: 0.8em;

          svg {
            font-size: 1.4em;
          }
        }
      }

      button {
        align-self: center;
        padding: 0.5em 3em;
      }
    }
  }
}
</style>
