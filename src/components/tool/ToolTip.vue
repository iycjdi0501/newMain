<template>
  <div class="tool-tip">
    <div class="content-wrapper">
      <slot class="content" />
    </div>
    <span
      v-if="messages.length"
      class="message"
      :class="theme"
      :style="{ width: messageBoxWidth }"
    >
      <span v-if="typeof messages === 'string'" v-html="messages" />
      <ul v-else>
        <li v-for="message in messages" :key="message">{{ message }}</li>
      </ul>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: [String, Array],
      default: '',
    },
    theme: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    messageBoxWidth() {
      let array
      if (typeof this.messages === 'string') {
        array = this.messages.split('<br>')
      } else {
        array = this.messages
      }
      const width = Math.max(...array.map((text) => text.length))
      return `${width*1.5}em`
    },
  },
}
</script>

<style lang="scss" scoped>
.tool-tip {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  .content-wrapper:hover + .message {
    visibility: visible;
    opacity: 1;
    bottom: calc(100% + 1.5em);
    transition: 0.3s;
  }

  .message {
    visibility: hidden;
    opacity: 0;
    padding: 1em;
    position: absolute;
    bottom: calc(100% + 1em);
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;

    &:before,
    &:after {
      content: '';
      width: 0;
      height: 0;
      z-index: 2;
      position: absolute;
      bottom: calc(-1em + 1px);
      border: solid 1em transparent;
      border-bottom: 0;
      border-top-color: $color-contrast;
    }

    &:before {
      bottom: -1em;
      z-index: 1;
    }

    span {
      align-self: center;
      text-align: center;
    }

    ul {
      list-style-position: inside;
    }

    &.default {
      color: $color-default;
      background-color: $background-default;
      border: 1px solid $border-default;

      &:after,
      &:before {
        left: 0;
        right: 0;
        margin: 0 auto;
      }

      &:after {
        border-top-color: $background-default;
      }

      &:before {
        border-top-color: $border-default;
      }
    }

    &.error {
      color: $color-error;
      background-color: $background-default;
      border: 1px solid $border-error;

      &:after,
      &:before {
        left: 0;
        right: 0;
        margin: 0 auto;
      }

      &:after {
        border-top-color: $background-default;
      }

      &:before {
        border-top-color: $border-error;
      }
    }

    &.dark {
      color: $color-contrast;
      background-color: $background-dark;
      border: 1px solid $border-contrast;

      left: -4em;

      &:before,
      &:after {
        left: 3.5em;
        margin: 0;
      }

      &:after {
        border-top-color: $background-dark;
      }

      &:before {
        border-top-color: $border-contrast;
      }
    }
  }
}

@media (max-width: 1024px) {
  .tool-tip {
    .message {
      max-width: 90vw;
    }
  }
}
</style>
