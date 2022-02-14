<template>
  <div class="control-btn-box">
    <button v-if="formIndex !== 1" type="button" @click="$emit('update:formIndex', --formIndex)">
      이전으로
    </button>
    <tool-tip class="submit-box" :messages="nextDisabledMessages" theme="error">
      <button
        v-if="formIndex !== 7"
        type="button"
        @click="$emit('update:formIndex', ++formIndex)"
        :disabled="false"
        class="next"
      >
        다음으로
      </button>
    </tool-tip>
  </div>
</template>

<script>
import ToolTip from '@/components/tool/ToolTip'
export default {
  components: {ToolTip},
  props: {
    formIndex: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    nextDisabledMessages: {
      type: Array,
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.control-btn-box {
  display: flex;
  justify-content: center;
  .submit-box{
    align-self: center;
  }
  button {
    width: 8.5em;
    border-radius: 0.3em;
    font-size: 1.375em;
    font-weight: 500;
    border: 1px solid #d6d6d6;
    background: $color-contrast;
    padding: 0.5em 0;
    margin: 0 1%;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
  }
  .next{
    background: $color-primary;
    color: $color-contrast;
  }
  .next:disabled{
    background: $color-contrast;
    color: #767676;
  }
}
</style>
