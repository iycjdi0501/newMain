<template>
  <button class="button" v-bind="$attrs" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.button {
  padding: 0.5em;
  border: 1px solid $border-primary;
  border-radius: 0.7em;
  background-color: $border-primary;
  color: $color-contrast;
  cursor: pointer;
  transition: 0.3s;
  font: {
    family: 'Noto Sans KR', sans-serif;
    size: 1.25em;
    weight: 400;
  }

  &:disabled {
    cursor: default;
    border: 1px solid $border-disable;
    color: $color-disable;
    background-color: $background-default;
  }
}
</style>
