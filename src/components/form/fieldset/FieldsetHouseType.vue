<template>
  <base-fieldset legend="집 종류">
    <input-house-type
      v-model:houseType="houseType"
      @update:houseType="$emit('update:houseType', $event)"
      @update:errors="$emit('update:errors', $event)"
      ref="houseType"
    />
  </base-fieldset>
</template>

<script>
import BaseFieldset from '@/components/form/base/BaseFieldset'
import InputHouseType from '@/components/form/custom/InputHouseType'
export default {
  components: { InputHouseType, BaseFieldset },
  props: {
    houseType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods:{
    confirm(){
      this.$refs.houseType.confirm()
    }
  }
}
</script>

<style lang="scss" scoped></style>
