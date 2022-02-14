<template>
  <base-fieldset legend="확인 사항">
    <input-visitable-direct-transaction
      :visitable="visitable"
      :directTransaction="directTransaction"
      @update:visitable="$emit('update:visitable', $event)"
      @update:directTransaction="$emit('update:directTransaction', $event)"
      @update:errors="$emit('update:errors', $event)"
      ref="visitable"
     />
  </base-fieldset>
</template>

<script>
import BaseFieldset from '@/components/form/base/BaseFieldset'
import InputVisitableDirectTransaction from '@/components/form/custom/InputVisitableDirectTransaction.vue'
export default {
  components: { BaseFieldset, InputVisitableDirectTransaction },
  props: {
    visitable: {
      type: String,
      default: "",
    },
    directTransaction: {
      type: String,
      default: "",
    },
  },
  methods: {
    confirm(){
      this.$refs.visitable.confirm()
    }
  }
}
</script>

<style scoped></style>
