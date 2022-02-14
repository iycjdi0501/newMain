<template>
  <div class="floor-container">
    <cover label="층수">
      <div class="flex-box">
        <base-select
          label="건물 층수"
          :options="buildingFloorOptions"
          :model-value="buildingFloor"
          @update:model-value=";(buildingFloorData = $event), confirm()"
        />
        <transition name="fade">
          <base-select
            v-if="buildingFloor"
            label="해당 층수"
            :options="relevantFloorOptions"
            :model-value="relevantFloor"
            @update:model-value=";(relevantFloorData = $event), confirm()"
          />
        </transition>
      </div>
      <error-field :errors="errors" />
    </cover>
  </div>
</template>

<script>
import Cover from '@/components/form/Cover'
import BaseSelect from '@/components/form/base/BaseSelect'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { Cover, BaseSelect, ErrorField },
  props: {
    buildingFloor: {
      type: String,
      default: '',
    },
    relevantFloor: {
      type: String,
      default: '',
    },
    houseType: {
      type: String,
      default: '',
    },
  },
  computed: {
    relevantFloorOptions() {
      let array = this.buildingFloorOptions.slice(0, this.buildingFloor)
      if (['원룸', '투룸', '쓰리룸'].includes(this.houseType)) {
        array.unshift({ label: '반지하', value: '반지하' })
        array.push({ label: '옥탑방', value: '옥탑방' })
      }
      return array
    },
  },
  data() {
    return {
      buildingFloorOptions: this.createFloorOptions(50),
      buildingFloorData: this.buildingFloor,
      relevantFloorData: this.relevantFloor,
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.errors = []

      if (
        !(
          Number.parseInt(this.buildingFloorData) <= 50 &&
          Number.parseInt(this.buildingFloorData) > 0
        )
      ) {
        error = '건물 층수를 선택해주세요.'
        errors.push(error)
      } else if (
        !(
          ['반지하', '옥탑방'].includes(this.relevantFloorData) ||
          (Number.parseInt(this.relevantFloorData) >= 1 &&
            Number.parseInt(this.relevantFloorData) <=
              Number.parseInt(this.buildingFloorData))
        )
      ) {
        error = '해당 층수를 선택해주세요.'
        errors.push(error)
      }

      this.errors = errors
      this.$emit('update:buildingFloor', this.buildingFloorData)
      this.$emit('update:relevantFloor', this.relevantFloorData)
      this.$emit('update:errors', this.errors)
    },
    createFloorOptions(range) {
      let array = []
      for (let i = 1; i <= range; i++) {
        array.push({ label: i + '층', value: i.toString() })
      }
      return array
    },
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
