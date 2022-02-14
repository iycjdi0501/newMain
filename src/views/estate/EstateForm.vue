<template>
  <div class="estate-form">
    <div class="wrapper">
      <form-progress-bar
        :formIndex="formIndex"
        :sections="!isMobile ? sections : new Array(8).fill('')"
        class="progress-bar"
      />
      <div class="guide-text" v-if="formIndex === 1">
        <h2>집 내놓기</h2>
        <ul>
          <li>
            매물 등록 요청 후 믿음직한 변호사가 확실한 검증을 거친 후 정상적으로
            등록됩니다.
          </li>
          <li>매물 등록 요청 후 노출 시까지 영업일 기준 1~2일이 소요됩니다.</li>
          <li>
            허위 매물 등록 시 통보없이 삭제될 수 있으며, 서비스 이용에 불이익이
            발생 할 수 있습니다.
          </li>
          <li>
            악의적인 행위 적발 시 서비스 이용에 불이익이 발생 할 수 있으며
            경우에 따라 법적 책임이 따를 수 있습니다.
          </li>
        </ul>
      </div>
      <form @submit.prevent="postRealEstate">
        <fieldset-house-type
          :house-type="form.houseInfo.type"
          @update:house-type="updateHouseType"
          @update:errors="errors = $event"
          v-if="formIndex === 1"
          ref="houseTypeField"
        />
        <fieldset-location-info
          :building="form.locationInfo.building"
          @update:building="updateBuilding"
          @update:errors="errors = $event"
          v-model:address="address"
          v-model:roadAddress="roadAddress"
          v-model:noneBuilding="noneBuilding"
          v-model:unit="form.locationInfo.unit"
          v-model:latitude="form.locationInfo.coordinate.latitude"
          v-model:longitude="form.locationInfo.coordinate.longitude"
          @buildingName="updateBuildingName"
          v-if="formIndex === 2"
          ref="locationInfoField"
        />
        <fieldset-transaction-info
          :type="form.transactionInfo.type"
          @update:type="updateTransactionType"
          @update:errors="errors = $event"
          v-model:deposit="form.transactionInfo.deposit"
          v-model:monthly-rent-cost="form.transactionInfo.monthlyRentCost"
          v-model:rental-cost="form.transactionInfo.rentalCost"
          v-model:sale-price="form.transactionInfo.salePrice"
          v-model:management-fees="form.transactionInfo.managementFees"
          :move-in-type="form.transactionInfo.moveInType"
          @update:move-in-type="updateMoveInType"
          v-model:move-in-date="form.transactionInfo.moveInDate"
          v-if="formIndex === 3"
          ref="transactionInfoField"
        />
        <fieldset-house-info
          :house-type="form.houseInfo.type"
          @update:errors="errors = $event"
          v-model:pyeong="form.houseInfo.area.pyeong"
          v-model:room-count="form.houseInfo.roomCount"
          v-model:bathroom-count="form.houseInfo.bathroomCount"
          :structure="form.houseInfo.structure"
          @update:structure="updateStructure"
          :building-floor="form.houseInfo.buildingFloor"
          @update:building-floor="updateBuildingFloor"
          v-model:relevant-floor="form.houseInfo.relevantFloor"
          v-if="formIndex === 4"
          ref="houseInfoField"
        />
        <fieldset-more-info
          :transaction-type="form.transactionInfo.type"
          v-model:parking="form.moreInfo.parking"
          v-model:elevator="form.moreInfo.elevator"
          v-model:pet="form.moreInfo.pet"
          v-model:built-in="form.moreInfo.builtIn"
          v-model:option="form.moreInfo.option"
          v-if="formIndex === 5"
        />
        <fieldset-visitable-direct-transaction
          v-model:visitable="form.visitable"
          v-model:direct-transaction="form.directTransaction"
          @update:errors="errors = $event"
          v-if="formIndex === 6"
          ref="visitable"
        />
        <fieldset-room-images
          v-model:room-images="form.roomImages"
          @update:errors="errors = $event"
          v-if="formIndex === 7"
          ref="roomImagesField"
        />
        <fieldset-detail-description
          v-model:description="form.detailDescription.description"
          :private-memo="form.detailDescription.privateMemo"
          @update:private-memo="updatePrivateMemo"
          @update:errors="errors = $event"
          v-if="formIndex === 8"
          ref="detailDescriptionField"
        />
        <div class="btn-box">
          <div class="control-btn-box">
            <button
              v-if="formIndex !== 1"
              type="button"
              @click="$emit('update:formIndex', --formIndex)"
            >
              이전으로
            </button>
            <tool-tip
              class="submit-box"
              :messages="!isMobile ? errors : []"
              theme="error"
            >
              <button
                v-if="formIndex !== 8"
                type="button"
                @click="confirm()"
                class="next"
              >
                다음으로
              </button>
            </tool-tip>
          </div>
          <tool-tip
            class="submit-box"
            :messages="isMobile ? errors : []"
            theme="error"
            v-if="formIndex === 8"
          >
            <base-button
              id="regist-sale"
              type="submit"
              :disabled="errors?.length > 0"
              @submit.prevent
            >
              집 내놓기
            </base-button>
          </tool-tip>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import FieldsetHouseType from '@/components/form/fieldset/FieldsetHouseType'
import FieldsetLocationInfo from '@/components/form/fieldset/FieldsetLocationInfo'
import FieldsetTransactionInfo from '@/components/form/fieldset/FieldsetTransactionInfo'
import FieldsetHouseInfo from '@/components/form/fieldset/FieldsetHouseInfo'
import FieldsetMoreInfo from '@/components/form/fieldset/FieldsetMoreInfo'
import FieldsetRoomImages from '@/components/form/fieldset/FieldsetRoomImages'
import FieldsetDetailDescription from '@/components/form/fieldset/FieldsetDetailDescription'
import FieldsetVisitableDirectTransaction from '@/components/form/fieldset/FieldsetVisitableDirectTransaction'
import BaseButton from '@/components/form/base/BaseButton'
import FormIndexControlButton from '@/components/form/FormIndexControlButton'
import FormProgressBar from '@/components/form/FormProgressBar'
import { mapGetters } from 'vuex'
import ToolTip from '@/components/tool/ToolTip'

import { errorHandler } from '@/modules/errorHandler'

export default {
  components: {
    ToolTip,
    BaseButton,
    FieldsetDetailDescription,
    FieldsetRoomImages,
    FieldsetMoreInfo,
    FieldsetLocationInfo,
    FieldsetTransactionInfo,
    FieldsetHouseInfo,
    FieldsetHouseType,
    FieldsetVisitableDirectTransaction,
    FormIndexControlButton,
    FormProgressBar,
  },
  data() {
    return {
      form: {
        roomImages: [],
        locationInfo: {
          coordinate: {},
        },
        transactionInfo: {},
        houseInfo: {
          area: {},
        },
        moreInfo: {
          option: [],
        },
        detailDescription: {
          description:
            '작성 예시 입니다. 내놓을 집에 맞춰 소개 할 내용을 수정해 주세요!\n\n- 주거 만족도\n햇빛도 잘 들어오고 바람도 잘 통해요.\n이중 출입 보안과 경비원이 상주하기 때문에 안전합니다.\n\n- 교통편\n지하철역까지 걸어서 5분 이내 위치하고 있으며, 버스 정류장은 바로 앞에 있습니다.\n\n- 편의시설\n집 앞에 편의점과 약국도 있고 가까운 거리에 대형마트도 있습니다.\n\n- 기타\n',
        },
        visitable: '',
        directTransaction: '',
      },
      address: null,
      errors: [],
      noneBuilding: false,
      roadAddress: '',
      formIndex: 1,
      sections: [
        '집 종류',
        '위치 정보',
        '거래 정보',
        '집 정보',
        '추가 정보',
        '확인 사항',
        '사진 등록',
        '상세 설명',
      ],
      isEndForm: false,
    }
  },
  beforeRouteLeave(to, from, next) {
    const guide =
      '이 사이트에서 나가시겠습니까?\n변경사항이 저장되지 않을 수 있습니다.'
    if (this.isEndForm) {
      next()
    } else {
      if (confirm(guide)) {
        next()
      }
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
  },
  methods: {
    async confirm() {
      switch (this.formIndex) {
        case 1:
          await this.$refs.houseTypeField.confirm()
          break
        case 2:
          await this.$refs.locationInfoField.confirm()
          break
        case 3:
          await this.$refs.transactionInfoField.confirm()
          break
        case 4:
          await this.$refs.houseInfoField.confirm()
          break
        case 6:
          await this.$refs.visitable.confirm()
          break
        case 7:
          await this.$refs.roomImagesField.confirm()
          break
        case 8:
          await this.$refs.detailDescriptionField.confirm()
      }
      const isError = this.errors.length > 0
      if (!isError) this.formIndex += 1
    },
    postRealEstate() {
      if (!this.errors[0]) {
        if (this.form.transactionInfo.moveInType !== '날짜 선택') {
          this.updateMoveInType(this.form.transactionInfo.moveInType)
        }
        this.updateTransactionType(this.form.transactionInfo.type)
        let form = this.form
        form.visitable = form.visitable === 'true' ? true : false
        form.directTransaction =
          form.directTransaction === 'true' ? true : false
        this.$store
          .dispatch('postRealEstate', form)
          .then((id) => {
            this.isEndForm = true
            this.$store.dispatch('insertNotification', {
              content: '매물이 등록되었습니다.',
            })
            this.$router.push({ name: 'MyEstateDetail', params: { id } })
          })
          .catch(errorHandler)
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 접근입니다.',
        })
      }
    },
    updateBuildingName(value) {
      value
        ? (this.form.locationInfo.buildingName = value)
        : delete this.form.locationInfo.buildingName
    },
    updateHouseType(value) {
      this.form.houseInfo.type = value
      delete this.form.houseInfo.structure
      delete this.form.houseInfo.relevantFloor
    },
    updateBuilding(value) {
      value
        ? (this.form.locationInfo.building = value)
        : delete this.form.locationInfo.building
    },
    updateTransactionType(value) {
      this.form.transactionInfo.type = value
      if (value === '월세') {
        delete this.form.transactionInfo.rentalCost
        delete this.form.transactionInfo.salePrice
      } else if (value === '전세') {
        delete this.form.transactionInfo.deposit
        delete this.form.transactionInfo.monthlyRentCost
        delete this.form.transactionInfo.salePrice
      } else {
        delete this.form.transactionInfo.deposit
        delete this.form.transactionInfo.monthlyRentCost
        delete this.form.transactionInfo.rentalCost
      }
    },
    updateMoveInType(value) {
      this.form.transactionInfo.moveInType = value
      delete this.form.transactionInfo.moveInDate
    },
    updateBuildingFloor(value) {
      this.form.houseInfo.buildingFloor = value
      delete this.form.houseInfo.relevantFloor
    },
    updatePrivateMemo(value) {
      value
        ? (this.form.detailDescription.privateMemo = value)
        : delete this.form.detailDescription.privateMemo
    },
    updateStructure(value) {
      if (value === '해당 없음') {
        delete this.form.houseInfo.structure
      } else {
        this.form.houseInfo.structure = value
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.estate-form {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10em;

  .wrapper {
    margin-top: 2em;
    width: 1080px;

    .guide-text {
      h2 {
        margin: 0.5em 0;
        font: {
          size: 2em;
          weight: 400;
        }
      }

      ul {
        list-style-position: inside;

        padding: 0 1em;

        li {
          margin: 0.2em 0;
          font: {
            weight: 400;
          }
        }

        li::marker {
          font-size: 0.1em;
        }
      }
    }

    .progress-bar {
      display: block;
    }

    form {
      margin-top: 2em;
      display: flex;
      flex-direction: column;
      gap: 5em;
    }

    .btn-box {
      display: flex;
      justify-content: center;

      .control-btn-box {
        display: flex;
        justify-content: center;

        .submit-box {
          align-self: center;
        }

        button {
          width: 8.5em;
          border-radius: 0.3em;
          font-size: 1.375em;
          font-weight: 500;
          border: 1px solid #d6d6d6;
          background: $color-contrast;
          padding: 0.5em 0;
          margin: 0 1%;
          cursor: pointer;
          font-family: 'Noto Sans KR', sans-serif;
        }

        .next {
          background: $color-primary;
          color: $color-contrast;
        }

        .next:disabled {
          background: $color-contrast;
          color: #767676;
        }
      }
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

@media (max-width: 1024px) {
  .estate-form {
    font-size: 0.875em;
    padding: 1em;

    .wrapper {
      margin-top: 0;
      width: 100%;

      form {
        font-size: 0.9em;
      }
    }
  }
}
</style>
