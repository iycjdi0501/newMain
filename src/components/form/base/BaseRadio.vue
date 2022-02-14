<template>
  <div class="radio" :class="theme">
    <input
      type="radio"
      :id="uuid"
      :checked="modelValue === value"
      :value="value"
      v-bind="$attrs"
      @change="$emit('update:modelValue', value)"
    />
    <label
      v-if="label"
      :for="uuid"
      :style="{ width: width }"
      :class="{ padding: theme === 'fixed-1' && label.length < 20 }"
      ><span>{{ label }}</span></label
    >
  </div>
</template>

<script>
import { v4 as uuidV4 } from 'uuid'

export default {
  props: {
    width: {
      type: String,
      default: '7em',
    },
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    value: {
      type: [String, Number],
      required: true,
    },
    theme: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      uuid: uuidV4(),
    }
  },
}
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  align-items: center;

  input {
    margin: 0 1em;
    opacity: 0;
  }

  label {
    position: relative;
    cursor: pointer;
    font: {
      size: 0.875em;
      weight: 500;
    }
  }

  label:before {
    content: '';
    position: absolute;
    width: 1.4em;
    height: 1.4em;
    left: -2.2em;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: 1px solid $border-disable;
    box-sizing: border-box;
    border-radius: 50%;
  }

  label:after {
    content: '';
    position: absolute;
    width: 1.4em;
    height: 1.4em;
    left: -2.2em;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: 0.4em solid transparent;
    box-sizing: border-box;
    border-radius: 50%;
  }

  input:checked + label:before {
    border: none;
    transition: 0.5s;
  }

  input:checked + label:after {
    border-color: $border-primary;
    text-shadow: $box-shadow-focus;
    transition: 0.5s;
  }

  &.fieldset {
    label {
      padding: 0.4em 0;
      text-align: center;
      color: $color-disable;
      border: 2px solid $border-disable;
      border-radius: 0.5em;
      font: {
        size: 1em;
        weight: 400;
      }
    }

    input:checked + label {
      color: $color-default;
      border-color: $border-primary;
      box-shadow: $box-shadow-focus;
      font: {
        weight: 500;
      }
      transition: 0.3s;
    }

    input {
      display: none;
    }

    label:before,
    label:after {
      display: none;
    }
  }
}
.fixed-1 {
  display: flex;
  gap: 1em;
  label {
    display: flex;
    align-items: center;
    height: 4em;
    padding: 0.7em;
    font-size: 1.2em;
    flex-grow: 1;
  }
}
</style>
