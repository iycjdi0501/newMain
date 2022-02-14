<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="wrapper" :class="theme">
      <font-awesome-icon
        class="close"
        @click="$emit('close')"
        :icon="['fal', 'times']"
        v-if="closebtn"
      />
      <h3 v-if="header && theme === 'naming'">{{ header }}</h3>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'flat',
    },
    header: {
      type: String,
      default: '',
    },
    closebtn: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  width: 100vw;
  height: 100vh;
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $background-modal;

  .wrapper {
    position: relative;
    border-radius: 1em;
    background-color: $background-default;

    &.naming {
      padding: 1em;

      h3 {
        padding-bottom: 1em;
        border-bottom: 1px solid $border-disable;
        font: {
          weight: 500;
          size: 1.125em;
        }
      }
    }

    .close {
      position: absolute;
      top: 0.6em;
      right: 0.8em;
      cursor: pointer;
      color: $color-disable;
      font: {
        size: 1.5em;
      }
    }
  }
}

@media (max-width: 1024px) {
  .modal {
    .wrapper {
      max-width: 90vw;
      max-height: 90vh;
    }
  }
  .sign-in {
    overflow: scroll;
    width: 90vw !important;
    height: 70vh !important;
  }
}
</style>
