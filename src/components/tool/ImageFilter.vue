<template>
  <span class="filter" :class="{ active }">
    {{ print }}
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
  },
  computed: {
    print() {
      return this.active ? this.message : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.filter {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $color-contrast;
  font: {
    family: 'Noto Sans KR', sans-serif;
    weight: 400;
  }

  &.active {
    background-color: $background-filter;
  }
}
</style>
