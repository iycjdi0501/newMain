<template>
  <div class="phone" :class="theme">
    <label v-if="label" :class="{ required }">{{ label }}</label>
    <div>
      <base-input
        :model-value="modelValue"
        @update:model-value="updatePhoneNumber"
        :placeholder="placeholder"
        :maxlength="maxLength"
      />
      <base-button
        v-if="verify"
        :disabled="disabled"
        type="button"
        @click="getVerify(modelValue)"
      >
        인증번호전송
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'
import BaseButton from '@/components/form/base/BaseButton'

export default {
  name: 'Phone',
  components: { BaseButton, BaseInput },
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    getVerify: {
      type: Function,
    },
    disabled: {
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'default',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    maxLength() {
      return this.modelValue.slice(0, 2) === '02' ? 12 : 13
    }
  },
  methods: {
    updatePhoneNumber(event) {
      this.$emit('update:modelValue', this.autoHyphen(event))
    },
    autoHyphen(value) {
      value = value.replace(/\D/g, '')
      if (value.slice(0, 2) === '02') {
        if (value.length > 2) {
          value = `${value.slice(0, 2)}-${value.slice(2)}`
        }
        if (value.length > 6) {
          value = `${value.slice(0, 6)}-${value.slice(6)}`
        }
        if (value.length > 11) {
        value = value.replace(/\D/g, '')
          if (value.slice(0, 2) === '02') {
            value = `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6)}`
          } else {
            value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`
          }
        }
        if (value.length > 12) {
          value = `${value.slice(0, 13)}`
        }
      } else {
        if (value.length > 3) {
          value = `${value.slice(0, 3)}-${value.slice(3)}`
        }
        if (value.length > 7) {
          value = `${value.slice(0, 7)}-${value.slice(7)}`
        }
        if (value.length > 12) {
          value = value.replace(/\D/g, '')
          value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`
        }
        if (value.length > 13) {
          value = `${value.slice(0, 13)}`
        }
      }
      return value
    },
  },
}
</script>

<style lang="scss" scoped>
.phone {
  display: flex;
  align-items: center;
  gap: 1em;

  > div {
    flex-grow: 1;
    display: flex;
    gap: 1em;

    > div {
      flex-grow: 1;
    }

    button {
      flex-shrink: 0;
    }
  }

  label {
    width: 5em;
    flex-shrink: 0;
    font: {
      size: 1.125em;
      weight: 500;
    }

    &.required:before {
      content: '⁕';
      margin-right: 0.25em;
      color: $color-error;
      font: {
        size: 1.5em;
      }
    }
  }

  &.fixed-4 {
    label {
      width: 4em;
    }
  }

  &.fixed-6 {
    label {
      width: 6em;
    }
  }

  &.fixed-7 {
    label {
      width: 7em;
    }
  }

  &.fixed-8 {
    label {
      width: 8em;
    }
  }
}
</style>
