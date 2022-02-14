<template>
  <div class="estate-update">
    <div class="wrapper">
      <h2>내 집 수정하기</h2>
      <form v-if="estate" @submit.prevent="updateRealEstate">
        <fieldset-transaction-info
          :type="estate.transactionInfo.type"
          @update:type="updateTransactionType"
          v-model:deposit="estate.transactionInfo.deposit"
          v-model:monthly-rent-cost="estate.transactionInfo.monthlyRentCost"
          v-model:rental-cost="estate.transactionInfo.rentalCost"
          v-model:sale-price="estate.transactionInfo.salePrice"
          v-model:management-fees="estate.transactionInfo.managementFees"
          :move-in-type="estate.transactionInfo.moveInType"
          @update:move-in-type="updateMoveInType"
          v-model:move-in-date="estate.transactionInfo.moveInDate"
        />
        <fieldset-more-info
          :transaction-type="estate.transactionInfo.type"
          v-model:parking="estate.moreInfo.parking"
          v-model:elevator="estate.moreInfo.elevator"
          v-model:pet="estate.moreInfo.pet"
          v-model:built-in="estate.moreInfo.builtIn"
          v-model:option="estate.moreInfo.option"
          v-model:visitable="estate.visitable"
          v-model:direct-transaction="estate.directTransaction"
        />
        <fieldset-room-images v-model:room-images="estate.roomImages" />
        <fieldset-detail-description
          v-model:description="estate.detailDescription.description"
          :private-memo="estate.detailDescription.privateMemo"
          @update:private-memo="updatePrivateMemo"
        />
        <tool-tip class="submit-box" :messages="errorMessages" theme="error">
          <base-button
            type="submit"
            :disabled="!!errorMessages.length"
            @submit.prevent
          >
            수정하기
          </base-button>
        </tool-tip>
      </form>
    </div>
  </div>
</template>

<script>
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import FieldsetTransactionInfo from '@/components/form/fieldset/FieldsetTransactionInfo'
import FieldsetMoreInfo from '@/components/form/fieldset/FieldsetMoreInfo'
import FieldsetRoomImages from '@/components/form/fieldset/FieldsetRoomImages'
import FieldsetDetailDescription from '@/components/form/fieldset/FieldsetDetailDescription'
import { roomImageRegex } from '@/assets/data/regex'
import ToolTip from '@/components/tool/ToolTip'
import BaseButton from '@/components/form/base/BaseButton'

export default {
  components: {
    BaseButton,
    ToolTip,
    FieldsetDetailDescription,
    FieldsetRoomImages,
    FieldsetMoreInfo,
    FieldsetTransactionInfo,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      estate: null,
    }
  },
  computed: {
    errorMessages() {
      const transactionInfo = this.estate.transactionInfo
      const moreInfo = this.estate.moreInfo
      const roomImages = this.estate.roomImages
      const detailDescription = this.estate.detailDescription

      const messages = []

      if (!['월세', '전세', '매매'].includes(transactionInfo.type)) {
        messages.push('거래 유형을 선택해주세요.')
      } else if (
        (transactionInfo.type === '월세' &&
          !(transactionInfo.deposit && transactionInfo.monthlyRentCost)) ||
        (transactionInfo.type === '전세' && !transactionInfo.rentalCost) ||
        (transactionInfo.type === '매매' && !transactionInfo.salePrice)
      ) {
        messages.push('가격 정보를 입력해주세요.')
      } else if (
        transactionInfo.deposit > 100000000 ||
        transactionInfo.monthlyRentCost > 100000000 ||
        transactionInfo.rentalCost > 100000000 ||
        transactionInfo.salePrice > 100000000
      ) {
        messages.push('가격 정보에 입력하실 수 있는 금액을 초과했습니다.')
      }

      if (!transactionInfo.managementFees) {
        messages.push('관리비를 입력해주세요.')
      } else if (transactionInfo.managementFees > 100000000) {
        messages.push('입력하실 수 있는 관리비를 초과했습니다.')
      } 

      if (
        !['즉시 입주', '날짜 협의', '날짜 선택'].includes(
          transactionInfo.moveInType
        )
      ) {
        messages.push('입주 가능일을 선택해주세요.')
      } else if (
        transactionInfo.moveInType === '날짜 선택' &&
        !transactionInfo.moveInDate
      ) {
        messages.push('입주 희망 날짜를 선택해주세요.')
      }

      if (
        !JSON.stringify(moreInfo.parking) ||
        typeof moreInfo.parking !== 'boolean'
      ) {
        messages.push('주차 가능 여부를 선택해주세요.')
      }

      if (
        !JSON.stringify(moreInfo.elevator) ||
        typeof moreInfo.elevator !== 'boolean'
      ) {
        messages.push('엘리베이터 유무를 선택해주세요.')
      }

      if (!JSON.stringify(moreInfo.pet) || typeof moreInfo.pet !== 'boolean') {
        messages.push('반려동물 가능 여부를 선택해주세요.')
      }

      if (
        !JSON.stringify(moreInfo.builtIn) ||
        typeof moreInfo.builtIn !== 'boolean'
      ) {
        messages.push('빌트인 유무를 선택해주세요.')
      }

      if (
        moreInfo.option.length &&
        !moreInfo.option.every((item) =>
          [
            '가스레인지',
            '인덕션',
            '냉장고',
            '세탁기',
            '에어컨',
            '전자레인지',
            'TV',
            '옷장',
            '침대',
            '책상',
            '신발장',
            '비데',
            '도어락',
            '싱크대',
          ].includes(item)
        )
      ) {
        messages.push('항목에 나열된 옵션을 선택해주세요.')
      }

      const urlRegex = roomImageRegex
      if (!(roomImages.length >= 5 && roomImages.length <= 10)) {
        messages.push('사진을 최소 5장 이상 최대 10장 이하로 등록해주세요.')
      } else if (!roomImages.every((url) => urlRegex.test(url))) {
        messages.push('사진을 업로드 중 입니다.')
      }

      if (
        !(detailDescription.description
          ? detailDescription.description.length >= 50 &&
            detailDescription.description.length <= 1000
          : false)
      ) {
        messages.push('상세 정보를 작성해주세요.')
      }

      if (
        !(detailDescription.privateMemo
          ? detailDescription.privateMemo.length <= 50
          : true)
      ) {
        messages.push('비공개 메모가 50자를 초과했습니다.')
      }

      return messages
    },
  },
  created() {
    this.$store
      .dispatch('fetchMyEstate', this.id)
      .then((estate) => (this.estate = estate))
      .catch((error) => errorHandler(error, ERROR_TYPE.PAGINATION))
  },
  methods: {
    updateRealEstate() {
      if (!this.errorMessages.length) {
        const form = {
          roomImages: this.estate.roomImages,
          transactionInfo: this.estate.transactionInfo,
          moreInfo: this.estate.moreInfo,
          detailDescription: this.estate.detailDescription,
        }
        for (let key in form) {
          delete form[key]._id
        }
        this.$store
          .dispatch('updateRealEstate', { id: this.estate._id, form })
          .then((id) => {
            this.$store.dispatch('insertNotification', {
              content: '매물이 등록되었습니다.',
            })
            this.$router.push({ name: 'MyEstateDetail', params: { id } })
          })
          .catch(errorHandler)
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 경로입니다.',
        })
      }
    },
    updateTransactionType(value) {
      this.estate.transactionInfo.type = value
      delete this.estate.transactionInfo.deposit
      delete this.estate.transactionInfo.monthlyRentCost
      delete this.estate.transactionInfo.rentalCost
      delete this.estate.transactionInfo.salePrice
    },
    updateMoveInType(value) {
      this.estate.transactionInfo.moveInType = value
      delete this.estate.transactionInfo.moveInDate
    },
    updatePrivateMemo(value) {
      value
        ? (this.estate.detailDescription.privateMemo = value)
        : delete this.estate.detailDescription.privateMemo
    },
  },
}
</script>

<style lang="scss" scoped>
.estate-update {
  padding: 3em;
  display: flex;
  justify-content: center;

  .wrapper {
    width: 1080px;

    h2 {
      margin: 0.5em 0;
      font: {
        size: 2em;
        weight: 400;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 5em;
    }
  }

  .submit-box {
    align-self: center;

    button {
      width: 8.5em;
      border-radius: 0.3em;
      font: {
        size: 1.375em;
        weight: 400;
      }
    }
  }
}
</style>
