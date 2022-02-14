<template>
  <div class="advantage-item">
    <div class="icon">
      <slot></slot>
    </div>
    <div class="title">{{ title }}</div>
    <div class="description" v-html="description"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.advantage-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    margin: 10px 0;
  }

  .icon {
    font: {
      size: 8em;
    }
  }

  .title {
    position: relative;
    font: {
      size: 1.5em;
      weight: 500;
    }

    &:before {
      position: absolute;
      content: '';
      left: -10%;
      right: -10%;
      margin: auto;
      bottom: 5px;
      width: 120%;
      border: {
        bottom: 4px solid $text-decoration;
      }
    }
  }

  .description {
    text-align: center;
    font: {
      size: 1.5em;
      weight: 300;
    }
  }
}
</style>
