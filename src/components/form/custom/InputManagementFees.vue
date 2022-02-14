<template>
  <cover label="관리비" class="cover">
    <div class="management-fees">
      <div class="flex-box">
        <base-input
          type="text"
          :useType="'price'"
          :model-value="managementFees"
          align="right"
          @update:model-value=";(managementFeesData = Number.parseInt($event)), confirm()
          "
          ><span>만원</span>
        </base-input>
      </div>
      <error-field v-if="errors" :errors="errors" />
      <div class="under-line"></div>
    </div>
  </cover>
</template>

<script>
import Cover from '@/components/form/Cover'
import BaseInput from '@/components/form/base/BaseInput'
import ErrorField from '@/components/form/ErrorField'
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
export default {
  components: { Cover, BaseCheckbox, BaseInput, ErrorField },
  props: {
    managementFees: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      managementFeesData: this.managementFees,
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.transactionInfoErrors = []

      if (this.managementFeesData > 10000000) {
        error = '입력하실 수 있는 관리비를 초과했습니다.'
        errors.push(error)
        this.transactionInfoErrors.push(error)
      }
      this.errors = errors
      this.$emit('update:managementFees', this.managementFeesData)
      this.$emit('update:errors', errors)
    },
  },
}
</script>

<style lang="scss" scoped>
.flex-box {
  padding: 1em;
  display: flex;
  gap: 2em;
  flex-wrap: wrap;

  label {
    align-self: center;
  }

  div {
    display: flex;
    gap: 1em;

    span {
      flex-shrink: 0;
    }

  }
}
.under-line {
  border-bottom: 1px solid $border-disable;
  padding-bottom: 1em;
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
