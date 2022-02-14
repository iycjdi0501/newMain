<template>
  <base-fieldset legend="집 정보">
    <input-supply 
      v-model:pyeong="pyeong"
      @update:pyeong="$emit('update:pyeong', $event)"
      @update:errors="pyeongErrors = $event, errorController()"
      ref="pyeong"
    />
    <input-room-count
      v-model:roomCount="roomCount"
      v-model:bathroomCount="bathroomCount"
      @update:roomCount="$emit('update:roomCount', $event)"
      @update:bathroomCount="$emit('update:bathroomCount', $event)"
      @update:errors=";(roomCountErrors = $event), errorController()"
      ref="roomCount"
    />
    <input-structure
      v-if="houseType === '오피스텔'"
      :houseType="houseType"
      v-model:structure="structure"
      @update:structure="$emit('update:structure', $event)"
      @update:errors=";(structureErrors = $event), errorController()"
      ref="structure"
    />
    <input-floor
      :houseType="houseType"
      v-model:buildingFloor="buildingFloor"
      v-model:relevantFloor="relevantFloor"
      @update:buildingFloor="$emit('update:buildingFloor', $event)"
      @update:relevantFloor="$emit('update:relevantFloor', $event)"
      @update:errors=";(floorErrors = $event), errorController()"
      ref="floor"
    />
  </base-fieldset>
</template>

<script>
import InputArea from '@/components/form/custom/InputArea'
import InputRoomCount from '@/components/form/custom/InputRoomCount.vue'
import InputStructure from '@/components/form/custom/InputStructure.vue'
import InputFloor from '@/components/form/custom/InputFloor'
import InputDirection from '@/components/form/custom/InputDirection'
import InputSupply from '@/components/form/custom/InputSupply'
import BaseFieldset from '@/components/form/base/BaseFieldset'
import BaseInput from '@/components/form/base/BaseInput'
import BaseRadioGroup from '@/components/form/base/BaseRadioGroup'
import BaseSelect from '@/components/form/base/BaseSelect'

export default {
  components: {
    InputArea,
    BaseSelect,
    BaseRadioGroup,
    BaseInput,
    BaseFieldset,
    InputRoomCount,
    InputStructure,
    InputFloor,
    InputDirection,
    InputSupply
  },
  props: {
    pyeong:{
      type: Number,
      default: 0,
    },
    roomCount: {
      type: Number,
      default: null,
    },
    bathroomCount: {
      type: Number,
      default: null,
    },
    houseType: {
      type: String,
      default: '',
    },
    structure: {
      type: String,
      default: '',
    },
    buildingFloor: {
      type: String,
      default: '',
    },
    relevantFloor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      pyeongErrors: [],
      roomCountErrors: [],
      structureErrors: [],
      floorErrors: [],
      errors: [],
    }
  },
  methods: {
    errorController() {
      this.errors = [
        ...this.pyeongErrors,
        ...this.roomCountErrors,
        ...this.structureErrors,
        ...this.floorErrors,
      ]
      this.$emit('update:errors', this.errors)
    },
    async confirm() {
      await this.$refs.pyeong.confirm()
      await this.$refs.roomCount.confirm()
      await this.$refs.floor.confirm()
      if(this.houseType === '오피스텔'){
        await this.$refs.structure.confirm()
      }

      this.errorController()
    },
  },
}
</script>

<style lang="scss" scoped></style>
