<template>
  <div class="sector">
    <h3 :class="{ column }">
      <span class="title">{{ title }}</span>
      <span v-if="subTitle" class="sub-title">{{ subTitle }}</span>
    </h3>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      default: '',
    },
    column: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.sector {
  h3 {
    padding: 0.75em 0.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid $border-default;

    &.column {
      flex-direction: column;
      align-items: flex-start;
    }

    .title {
      font: {
        weight: 500;
        size: 1.75em;
      }
    }

    .sub-title {
      font: {
        weight: 400;
      }
    }
  }
}
</style>
