<template>
  <div class="checkbox" :class="theme">
    <input
      type="checkbox"
      v-bind="$attrs"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :id="uuid"
    />
    <label :for="uuid" v-if="label">{{ label }}</label>
  </div>
</template>

<script>
import { v4 as uuidV4 } from 'uuid'

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
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
.checkbox {
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
    border: 1px solid $border-disable;
    border-radius: 50%;
    margin: auto 0;
    transform: rotate(45deg);
  }

  label:after {
    content: '✔';
    position: absolute;
    width: 1.4em;
    height: 1.4em;
    left: -2.2em;
    top: 0;
    bottom: 0;
    border: 1px solid transparent;
    margin: auto 0;
    font-weight: 600;
    color: $border-disable;
    text-align: center;
  }

  input:checked + label:before {
    border-top-color: $border-primary;
    border-right-color: $border-primary;
    border-bottom-color: $border-primary;
    border-left-color: $border-primary;
    box-shadow: $box-shadow-focus;
    transition: 0.5s, border-top-color 0.1s linear,
      border-right-color 0.1s linear 0.1s, border-bottom-color 0.1s linear 0.2s,
      border-left-color 0.1s linear 0.3s;
  }

  input:checked + label:after {
    color: $color-primary;
    transition: 0.5s, color 0.3s linear 0.4s;
    text-shadow: $box-shadow-focus;
  }

  &.fieldset {
    label {
      width: 7em;
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

@media (max-width: 1024px) {
  .checkbox {
    input {
      margin: 0 0.5em;
    }

    label:before {
      content: '';
      position: absolute;
      width: 1.4em;
      height: 1.4em;
      left: -2.2em;
      top: 0;
      bottom: 0;
      border: 1px solid $border-disable;
      border-radius: 50%;
      margin: auto 0;
      transform: none;
    }

    label:after {
      content: '';
      width: 0.5em;
      height: 0.5em;
      border-radius: 50%;
      left: -1.75em;
    }

    input:checked + label:before {
      background-color: $background-primary;
      box-shadow: $box-shadow-focus;
      transition: 0.5s;
    }

    input:checked + label:after {
      background-color: $background-default;
      transition: 0.5s;
    }
  }
}
</style>
