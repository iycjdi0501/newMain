<template>
  <div class="area-container">
    <cover label="면적">
      <div class="flex-box">
        <base-input
            label="공급 면적"
            type="number"
            step="0.01"
            :model-value="supply"
            @update:model-value="supplyData = Number.parseFloat($event), confirm()"
            @keydown="avoidThirdDecimal"
        >
          <span>㎡</span>
        </base-input>
        <base-input
            label="전용 면적"
            type="number"
            step="0.01"
            :model-value="dedicated"
            @update:model-value="dedicatedData = Number.parseFloat($event), confirm()"
            @keydown="avoidThirdDecimal"
        >
          <span>㎡</span>
        </base-input>
      </div>
      <error-field :errors="errors"/>
    </cover>
  </div>
</template>

<script>
import Cover from '@/components/form/Cover'
import BaseInput from '@/components/form/base/BaseInput'
import ErrorField from '@/components/form/ErrorField'
import {avoidHouseAreaFloatRegex, houseAreaFloatRegex} from '@/assets/data/regex'

export default {
  components: {Cover, BaseInput, ErrorField},
  props: {
    supply: {
      type: Number,
      default: null,
    },
    dedicated: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      supplyData: this.supply,
      dedicatedData: this.dedicated,
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.errors = []

      const floatRegex = houseAreaFloatRegex
      if (!this.supplyData) {
        error = '공급 면적을 입력해주세요.'
        errors.push(error)
      } else if (!floatRegex.test(this.supplyData)) {
        error = '공급 면적을 소수점 이하 두 자리까지 입력해주세요.'
        errors.push(error)
      } else if (this.supplyData > 10000) {
        error = '공급 면적을 10000 이하로 입력해주세요.'
        errors.push(error)
      }

      if (this.supplyData < this.dedicatedData) {
        error = '전용 면적은 공급 면적보다 클 수 없습니다.'
        errors.push(error)
      }

      if (!this.dedicatedData) {
        error = '전용 면적을 입력해주세요.'
        errors.push(error)
      } else if (!floatRegex.test(this.dedicatedData)) {
        error = '전용 면적을 소수점 이하 두 자리까지 입력해주세요.'
        errors.push(error)
      } else if (this.dedicatedData > 10000) {
        error = '전용 면적을 10000 이하로 입력해주세요.'
        errors.push(error)
      }

      this.errors = errors
      this.$emit('update:errors', this.errors)
      this.$emit('update:supply', this.supplyData)
      this.$emit('update:dedicated', this.dedicatedData)
    },
    avoidThirdDecimal(event) {
      const value = event.target.value
      if (event.keyCode === 8 || !value || !avoidHouseAreaFloatRegex.test(value)) {
        return true
      } else {
        return event.preventDefault()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.cover {
  .flex-box {
    padding: 1em;
    display: flex;
    gap: 2em;
    flex-wrap: wrap;

    &.under-line {
      border-bottom: 1px solid $border-disable;
    }
  }
}
</style>
