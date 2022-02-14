<template>
  <base-fieldset legend="거래 정보">
    <input-transaction-info
      v-model:type="type"
      v-model:deposit="deposit"
      v-model:monthlyRentCost="monthlyRentCost"
      v-model:rentalCost="rentalCost"
      v-model:salePrice="salePrice"
      @update:type="$emit('update:type', $event)"
      @update:deposit="$emit('update:deposit', $event)"
      @update:monthlyRentCost="$emit('update:monthlyRentCost', $event)"
      @update:rentalCost="$emit('update:rentalCost', $event)"
      @update:salePrice="$emit('update:salePrice', $event)"
      @update:errors="this.transactionErrors = $event, errorController()"
      ref="transactionInfo"
    />
    <input-management-fees
      v-model:managementFees="managementFees"
      @update:managementFees="$emit('update:managementFees', Number.parseInt($event))"
      @update:errors="this.managementFeesErrors = $event, errorController()"
      ref="managementFees"
    />
    <input-move-in-type
      v-model:moveInType="moveInType"
      v-model:moveInDate="moveInDate"
      @update:moveInType="$emit('update:moveInType', $event)"
      @update:moveInDate="$emit('update:moveInDate', $event)"
      @update:errors="this.moveInDataErrors = $event, errorController()"
      ref="moveInData"
    />
  </base-fieldset>
</template>

<script>
import InputTransactionInfo from '@/components/form/custom/InputTransactionInfo'
import InputManagementFees from '@/components/form/custom/InputManagementFees'
import InputMoveInType from '@/components/form/custom/InputMoveInType'
import BaseFieldset from '@/components/form/base/BaseFieldset'

export default {
  components: {
    InputTransactionInfo,
    InputManagementFees,
    InputMoveInType,
    BaseFieldset,
  },
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
    managementFees: {
      type: Number,
      default: 0,
    },
    moveInType: {
      type: String,
      default: '',
    },
    moveInDate: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      managementFeesErrors: [],
      transactionErrors: [],
      moveInDataErrors: [],
      errors: [],
    }
  },
  methods:{
    errorController(){
      this.errors = [...this.transactionErrors, ...this.managementFeesErrors, ...this.moveInDataErrors]
      this.$emit('update:errors', this.errors)
    },
    async confirm(){
      await this.$refs.transactionInfo.confirm()
      await this.$refs.managementFees.confirm()
      await this.$refs.moveInData.confirm()

      this.errorController()
    }
  }
}
</script>