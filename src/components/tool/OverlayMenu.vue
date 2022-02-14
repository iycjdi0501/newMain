<template>
  <div class="overlay-menu">
    <div v-if="open" class="menu">
      <component
        v-for="item in model"
        :key="item.label"
        :is="pickComponentIs(item)"
        v-bind="bindAttribute(item)"
        @click="open = false"
      >
        {{ item.label }}
      </component>
    </div>
    <div class="content" @click="open = !open">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    pickComponentIs(item) {
      if (item.to) {
        return 'router-link'
      } else if (item.command) {
        return 'button'
      }
    },
    bindAttribute(item) {
      if (item.to) {
        return { to: item.to }
      } else if (item.command) {
        return { onClick: item.command }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.overlay-menu {
  position: relative;

  .menu {
    padding: 1em;
    z-index: 1;
    position: absolute;
    top: 100%;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    background-color: $background-dark;

    > * {
      white-space: nowrap;
      color: $color-contrast;
      text-decoration: none;
      background-color: transparent;
      border: none;
      cursor: pointer;
      font: {
        family: 'Noto Sans KR', sans-serif;
        size: 0.875em;
        weight: 400;
      }
    }
  }
}
</style>
