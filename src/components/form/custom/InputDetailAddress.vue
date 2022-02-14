<template>
  <cover class="address-detail" label="상세 주소">
    <div class="wrapper">
      <div class="input-box">
        <base-input
          label="동"
          theme="fixed-2"
          :model-value="building"
          @update:model-value="
            ;(buildingData = $event), confirm()
          "
          :disabled="noneBuilding"
        />
        <base-input
          label="호수"
          theme="fixed-2"
          :model-value="unit"
          @update:model-value="
            ;(unitData = $event), confirm()
          "
        />
      </div>
      <div class="check-box">
        <base-checkbox
          label="동 정보가 없는 경우 체크 해주세요."
          v-model:modelValue="noneBuilding"
          @input="removeBuildingValue"
        />
      </div>
      <div class="error-message" v-for="(error, idx) in errors" :key="idx">
        {{ error }}
      </div>
    </div>
  </cover>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import Cover from '@/components/form/Cover'
export default {
  components: { BaseInput, BaseCheckbox, Cover },
  props: {
    building: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: '',
    },
    noneBuilding: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      noneBuildingData: this.noneBuilding,
      buildingData: this.building,
      unitData: this.unit,
      errors: null,
    }
  },
  computed: {
    errorMessage() {
      return this.error
    },
  },
  methods: {
    removeBuildingValue(event) {
      this.noneBuildingData = event.target.checked
      this.buildingData = ''
      this.confirm()
    },
    confirm() {
      let errors = []
      if (!this.buildingData && !this.noneBuildingData) {
        errors.push('동 정보가 없다면 없음에 체크해주세요.')
      }

      if (!this.unitData) {
        errors.push('호수 정보를 입력해주세요.')
      }

      if (
        this.buildingData &&
        !(this.buildingData?.length >= 1 && this.buildingData?.length <= 10)
      ) {
        errors.push('동 정보를 1자 이상 10자 이하로 입력해주세요.')
      }

      if (!(this.unitData?.length >= 1 && this.unitData?.length <= 10)) {
        errors.push('호수 정보를 1자 이상 10자 이하로 입력해주세요.')
      }

      if (!errors) {
        errors = []
      }

      this.$emit('update:unit', this.unitData)
      this.$emit('update:building', this.buildingData)
      this.$emit('update:errors', errors)
      this.$emit('update:noneBuilding', this.noneBuildingData)
      this.errors = errors
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1em;
  .input-box {
    display: flex;
    gap: 2em;
  }
  .error-message {
    color: #ff0000;
    font-size: 0.9em;
  }
}

@media (max-width: 1024px){
  .wrapper > .input-box{
    flex-direction: column-reverse;
  }
}
</style>
