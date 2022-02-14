<template>
  <cover class="house-type-container" label="종류 선택">
    <span class="radio-box">
      <base-radio
        theme="fieldset"
        v-for="option in selectType.options"
        :label="option.label"
        :value="option.value"
        :name="selectType.name"
        :model-value="houseType"
        :theme="'default'"
        @update:model-value=";(houseTypeData = $event), confirm()"
      />
    </span>
    <error-field v-if="errors" :errors="errors" :margin="'0 0 0.5em 1em'" />
  </cover>
</template>

<script>
import BaseRadio from '@/components/form/base/BaseRadio'
import Cover from '@/components/form/Cover'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { BaseRadio, Cover, ErrorField },
  props: {
    houseType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      errors: [],
      houseTypeData: this.houseType,
      selectType: {
        label: '종류 선택',
        name: 'select-type',
        options: [
          /*****************************
           * 추후 원루 투룸 쓰리룸 업데이트 *
           *****************************/
          // {
          //   label: '원룸',
          //   value: '원룸',
          // },
          // {
          //   label: '투룸',
          //   value: '투룸',
          // },
          // {
          //   label: '쓰리룸',
          //   value: '쓰리룸',
          // },
          {
            label: '아파트',
            value: '아파트',
          },
          {
            label: '오피스텔',
            value: '오피스텔',
          },
        ],
      },
    }
  },
  methods: {
    confirm() {
      const errors = []
      if (
        !['원룸', '투룸', '쓰리룸', '아파트', '오피스텔'].includes(
          this.houseTypeData
        )
      ) {
        errors.push('집 종류를 선택해주세요.')
      }

      // if (
      //   ['쓰리룸', '아파트'].includes(houseInfo.type) &&
      //   houseInfo.structure
      // ) {
      //   messages.push('아파트 또는 쓰리룸은 구조를 선택할 수 없습니다.')
      // }

      // if (
      //   ['투룸', '오피스텔'].includes(houseInfo.type) &&
      //   !(houseInfo.structure ? houseInfo.structure === '복층' : true)
      // ) {
      //   messages.push('투룸 또는 오피스텔은 복층 구조만 선택할 수 있습니다.')
      // }

      // if (
      //   houseInfo.type === '원룸' &&
      //   !['오픈형', '분리형', '복층'].includes(houseInfo.structure)
      // ) {
      //   messages.push('원룸은 구조를 반드시 선택해주세요.')
      // }

      this.errors = errors
      this.$emit('update:houseType', this.houseTypeData)
      this.$emit('update:errors', this.errors)
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
</style>
