<template>
  <div class="textarea" :class="theme">
    <label :for="uuid" v-if="label">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :id="uuid"
    />
    <slot />
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
      type: [String, Number],
      default: '',
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
.textarea {
  display: flex;
  gap: 1em;
  align-items: stretch;

  label {
    align-self: center;
    font: {
      size: 1.125em;
      weight: 500;
    }
  }

  textarea {
    min-width: 0;
    flex-grow: 1;
    padding: 0.7em;
    border: 1px solid $border-disable;
    font: {
      size: 1em;
      family: 'Noto Sans KR', sans-serif;
    }
    resize: none;

    &::-webkit-scrollbar {
      width: 0.5em;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $background-primary;
      box-shadow: $box-shadow-solid;
      border-radius: 0.5em;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: $background-secondary;
    }

    &::-webkit-scrollbar-track {
      background-color: $background-foundation;
    }

    &:focus {
      outline: none;
      border: 1px solid $border-primary;
      box-shadow: $box-shadow-focus;
    }
  }

  &.fixed-label {
    label {
      width: 5em;
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

    textarea {
      height: 35em;
      margin: 1.25em;
      padding: 1em;
      font: {
        weight: 400;
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

    textarea {
      height: 300px;
    }
  }

  &.fieldset-slot {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    border-bottom: 1px solid $border-disable;

    label {
      grid-row: 1 / 3;
      width: 12.5em;
      height: 100%;

      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $background-foundation;
      font: {
        size: 1.25em;
        weight: 400;
      }
    }

    textarea {
      height: 35em;
      margin: 1.25em;
      padding: 1em;
      font: {
        weight: 400;
      }
    }
  }
}

@media (max-width: 1024px) {
  .textarea {
    &.fixed-label {
      label {
        width: 4em;
        flex-shrink: 0;
      }
    }
  }
}
</style>
