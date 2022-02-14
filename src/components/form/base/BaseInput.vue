<template>
  <div class="input" :class="theme">
    <label :for="uuid" v-if="label" :class="{ required }">{{ label }}</label>
    <input
      :class="align"
      v-bind="$attrs"
      :value="value"
      @input="inputValue($event.target.value)"
      :id="uuid"
      ref="inputValue"
    />
    <slot class="unit" />
  </div>
</template>

<script>
import { v4 as uuidV4 } from 'uuid'
import * as priceFormatter from '@/modules/priceFormatter'
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
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
    align: {
      type: String,
      default: 'left',
    },
    useType: {
      type: String,
      default: 'input',
    },
  },
  data() {
    return {
      uuid: uuidV4(),
    }
  },
  computed:{
    value(){
      if (this.useType === 'price') {
        return priceFormatter.insertComma(this.modelValue)
        
      } else {
        return this.modelValue
      }
    }
  },
  methods: {
    inputValue(value) {
      if (this.useType === 'price') {
        this.$refs.inputValue.value = priceFormatter.insertComma(value)
        this.$emit('update:modelValue', priceFormatter.extractNumber(value))
      } else {
        this.$emit('update:modelValue', value)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  gap: 1em;
  align-items: center;
  flex-grow: 1;

  label {
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

  input {
    min-width: 0;
    flex-grow: 1;
    padding: 0.7em;
    border: 1px solid $border-disable;
    font-size: 1em;

    &:focus {
      outline: none;
      border: 1px solid $border-primary;
      box-shadow: $box-shadow-focus;
    }

    &[type='number']::-webkit-outer-spin-button,
    &[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &.right {
      text-align: right;
    }
  }

  &.fixed-label {
    label {
      width: 5em;
    }
  }

  &.fixed-2 {
    label {
      width: 2em;
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

  &.fieldset {
    align-items: stretch;
    border-bottom: 1px solid $border-disable;

    label {
      width: 12.5em;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $background-foundation;
      font: {
        size: 1.25em;
        weight: 400;
      }
    }

    input {
      width: 0;
      margin: 1em;
      padding: 0.75em;
      font: {
        size: 1.25em;
      }
    }
  }

  &.column {
    flex-direction: column;

    label {
      align-self: flex-start;
      margin-top: 1em;
      width: 6em;
    }

    input {
      width: 100%;
    }
  }
}

@media (max-width: 1024px) {
  .input {
    label {
      width: auto;
    }

    input {
      width: 88px;
    }

    &.fixed-label {
      label {
        width: 4em;
      }
    }

    &.fieldset {
      label {
        width: 6em;
      }
    }
  }
}
</style>
