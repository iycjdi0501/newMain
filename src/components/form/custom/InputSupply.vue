<template>
  <div class="supply-container">
    <cover label="평수" class="cover">
      <div class="flex-box">
        <input
          type="Number"
          v-model="pyeongData"
          @input="$emit('update:pyeong', $event.target.value), confirm()"
        />
        <span>평</span>
      </div>
      <error-field :errors="errors" />
    </cover>
  </div>
</template>
<script>
import Cover from '@/components/form/Cover'
import BaseInput from '@/components/form/base/BaseInput'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { Cover, BaseInput, ErrorField },
  props: {
    pyeong: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pyeongData: null,
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error

      if (!this.pyeongData) {
        error = '면적을 입력해주세요.'
        errors.push(error)
      }
      if (this.pyeongData > 10000) {
        error = '입력하실 수 있는 단위를 초과하셨습니다.'
        errors.push(error)
      }

      this.errors = errors
      this.$emit('update:errors', this.errors)
      this.$emit('update:pyeong', Number(this.pyeongData))
    },
  },
}
</script>

<style lang="scss" scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.flex-box {
  padding: 1em;
  display: flex;
  gap: 1em;
  align-items: center;
  input{
    padding: 0.7em;
    border: 1px solid #d6d6d6;
  }
  span{
    font-size: 1.125em;
    font-weight: 500;
  }
}
</style>
