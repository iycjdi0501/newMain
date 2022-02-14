<template>
  <div class="radio-group" :class="theme">
    <span class="label" v-if="label">{{ label }}</span>
    <span class="radio-box">
      <base-radio
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :name="name"
        :theme="theme"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
      />
      <slot />
    </span>
  </div>
</template>

<script>
import BaseRadio from '@/components/form/base/BaseRadio'

export default {
  components: { BaseRadio },
  props: {
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    theme: {
      type: String,
      default: 'default',
    },
  },
}
</script>

<style lang="scss" scoped>
.radio-group {
  display: flex;
  gap: 1em;
  align-items: center;

  .label {
    width: 6em;
    font: {
      size: 1.125em;
      weight: 500;
    }
  }

  .radio-box {
    flex-grow: 1;
    padding: 0.7em;
    font-size: 1.125em;
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }

  &.fixed-label {
    .label {
      width: 5em;
    }
  }

  &.fixed-4 {
    .label {
      width: 4em;
    }
  }

  &.fieldset {
    align-items: stretch;
    border-bottom: 1px solid $border-disable;

    .label {
      flex-shrink: 0;
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

    .radio-box {
      padding: 1.5em 1em;
      font-size: 1em;
    }
  }
}

@media (max-width: 1024px) {
  .radio-group {
    &.fieldset {
      .label {
        width: 6em;
      }
    }
  }
}
</style>
