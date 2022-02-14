<template>
  <div class="spinner" :class="{ done: complete }"></div>
</template>

<script>
export default {
  props: {
    complete: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 2em;
  height: 2em;
  border-radius: 1em;
  position: relative;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;

    border: {
      top: 0.3em solid $border-primary;
      left: 0.3em solid $border-primary;
      right: 0.3em solid $border-primary;
      bottom: 0.3em solid transparent;
      radius: 50%;
    }

    animation: {
      name: spin;
      duration: 0.7s;
      iteration-count: infinite;
      timing-function: ease-in-out;
    }
  }

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    color: $color-contrast;

    border: {
      top: 0.3em solid transparent;
      left: 0.3em solid $border-secondary;
      right: 0.3em solid $border-secondary;
      bottom: 0.3em solid $border-secondary;
      radius: 50%;
    }

    animation: {
      name: spin;
      duration: 1.3s;
      iteration-count: infinite;
      timing-function: ease-in-out;
    }
  }

  &.done:before {
    transition: background-color 0.3s;
    animation: none;
    background-color: $background-primary;
    border-color: transparent;
  }

  &.done:after {
    content: '✔';
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.3em;
    border-color: transparent;
    animation: none;
  }
}
</style>
