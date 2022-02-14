<template>
  <div class="select" :class="theme">
    <label v-if="label">{{ label }}</label>
    <select
      :value="modelValue"
      v-bind="$attrs"
      @change="
        ($event) => {
          $emit('update:modelValue', $event.target.value)
        }
      "
    >
      <option v-if="placeHolder" disabled :selected="!modelValue" value="">
        {{ placeHolder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :selected="option.value === modelValue"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
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
    options: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      default: '',
    },
    placeHolder: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.select {
  display: flex;
  gap: 1em;
  align-items: center;

  label {
    font: {
      size: 1.125em;
      weight: 500;
    }
  }

  select {
    padding: 0.45em;
    border: 1px solid $border-disable;
    font: {
      size: 1em;
      family: 'Noto Sans KR', sans-serif;
      weight: 400;
    }

    &:focus {
      border: 1px solid $border-primary;
      outline: none;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background-color: $border-disable;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $border-primary;
      border-radius: 3px;
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
      flex-shrink: 0;
      background-color: $background-foundation;
      font: {
        size: 1.25em;
        weight: 400;
      }
    }

    select {
      align-self: center;
      flex-grow: 1;
      margin: 1em 5em 1em 1em;
    }
  }
}

@media (max-width: 1024px) {
  .select {
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
