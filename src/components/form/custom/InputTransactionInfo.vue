<template>
  <div>
    <cover class="house-type-container" label="유형 선택">
      <span class="radio-box">
        <base-radio
          theme="fieldset"
          v-for="option in types.options"
          :label="option.label"
          :value="option.value"
          :name="types.name"
          :model-value="type"
          :theme="'default'"
          @update:model-value="typeData = $event, confirm()"
        />
      </span>
      <error-field
        :errors="categoryErrors"
      />
    </cover>
    <transition name="fade" mode="out-in">
      <cover v-if="type" label="가격 정보" class="cover">
        <transition name="fade" mode="out-in">
          <div v-if="type === '월세'" class="flex-box">
            <base-input
              label="보증금"
              align="right"
              type="text"
              :useType="'price'"
              :model-value="deposit"
              @update:model-value=";(depositData = $event), confirm()"
              ><span>만원</span>
            </base-input>
            <base-input
              label="월세"
              align="right"
              type="text"
              :useType="'price'"
              :model-value="monthlyRentCost"
              @update:model-value=";(monthlyRentCostData = $event), confirm()"
              ><span>만원</span>
            </base-input>
          </div>
          <div v-else-if="type === '전세'" class="flex-box">
            <base-input
              label="전세금"
              type="text"
              align="right"
              :useType="'price'"
              :model-value="rentalCost"
              @update:model-value=";(rentalCostData = $event), confirm()"
              ><span>만원</span>
            </base-input>
          </div>
          <div v-else-if="type === '매매'" class="flex-box">
            <base-input
              label="매매금"
              type="text"
              align="right"
              :useType="'price'"
              :model-value="salePrice"
              @update:model-value=";(salePriceData = $event), confirm()"
              ><span>만원</span>
            </base-input>
          </div>
        </transition>
        <error-field :errors="priceErrors" />
        <p class="convert-unit">{{ unitPrice }}</p>
      </cover>
    </transition>
  </div>
</template>

<script>
import BaseRadio from '@/components/form/base/BaseRadio'
import Cover from '@/components/form/Cover'
import ErrorField from '@/components/form/ErrorField'
import BaseInput from '@/components/form/base/BaseInput'
import { setPriceUnit } from '@/modules/tools'
export default {
  components: { BaseRadio, Cover, ErrorField, BaseInput },
  props: {
    type: {
      type: String,
      default: '',
    },
    deposit: {
      type: Number,
      default: null,
    },
    monthlyRentCost: {
      type: Number,
      default: null,
    },
    rentalCost: {
      type: Number,
      default: null,
    },
    salePrice: {
      type: Number,
      default: null,
    },
  },
  computed: {
    unitPrice() {
      if (this.type === '전세') {
        return setPriceUnit(this.rentalCost)
      } else if (this.type === '매매') {
        return setPriceUnit(this.salePrice)
      } else {
        return ''
      }
    },
  },
  data() {
    return {
      typeData: this.type,
      depositData: this.deposit,
      monthlyRentCostData: this.monthlyRentCost,
      rentalCostData: this.rentalCost,
      salePriceData: this.salePrice,
      types: {
        label: '유형 선택',
        name: 'transaction-type',
        options: [
          {
            label: '월세',
            value: '월세',
          },
          {
            label: '전세',
            value: '전세',
          },
          {
            label: '매매',
            value: '매매',
          },
        ],
      },
      categoryErrors: [],
      priceErrors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.categoryErrors = []
      this.priceErrors = []

      if (!['월세', '전세', '매매'].includes(this.typeData)) {
        error = '거래 유형을 선택해주세요.'
        errors.push(error)
        this.categoryErrors.push(error)
      } 
      if (
        (this.typeData === '월세' &&
          !(this.depositData && this.monthlyRentCostData)) ||
        (this.typeData === '전세' && !this.rentalCostData) ||
        (this.typeData === '매매' && !this.salePriceData)
      ) {
        error = '가격 정보를 입력해주세요.'
        errors.push(error)
        this.priceErrors.push(error)
      } 
      if (this.depositData >= 1000000 ) {
        error = '보증금 가격 정보에 입력하실 수 있는 금액을 초과했습니다.'
        errors.push(error)
        this.priceErrors.push(error)
      }

      if (this.monthlyRentCostData >= 1000000 ) {
        error = '월세 가격 정보에 입력하실 수 있는 금액을 초과했습니다.'
        errors.push(error)
        this.priceErrors.push(error)
      }

      if (this.rentalCostData > 100000000 ||
        this.salePriceData > 100000000 ) {
        error = '가격 정보에 입력하실 수 있는 금액을 초과했습니다.'
        errors.push(error)
        this.priceErrors.push(error)
      }

      this.$emit('update:type', this.typeData)
      this.$emit('update:deposit', Number.parseInt(this.depositData))
      this.$emit(
        'update:monthlyRentCost',
        Number.parseInt(this.monthlyRentCostData)
      )
      this.$emit('update:rentalCost', Number.parseInt(this.rentalCostData))
      this.$emit('update:salePrice', Number.parseInt(this.salePriceData))
      this.$emit('update:errors', errors)
    },
  },
}
</script>

<style lang="scss" scoped>
.radio-box {
  flex-grow: 1;
  padding: 0.7em;
  font-size: 1.125em;
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}
.cover {
  .flex-box {
    padding: 1em;
    display: flex;
    gap: 2em;
    flex-wrap: wrap;

    &.under-line {
      border-bottom: 1px solid $border-disable;
    }

    label {
      align-self: center;
    }

    div {
      display: flex;
      gap: 1em;

      span {
        flex-shrink: 0;
      }

      &.management-items {
        flex-wrap: wrap;
      }
    }
  }

  .convert-unit {
    margin-top: -1em;
    padding: 0 4em 1em;
    text-align: right;

    color: $color-error;
  }
}

@media (max-width: 1024px) {
  .cover {
    .flex-box {
      .management-items-label {
        display: none;
      }
    }
  }
}
</style>
