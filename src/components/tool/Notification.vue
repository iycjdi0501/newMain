<template>
  <div class="notification-box">
    <transition-group name="list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <button class="close" @click="$emit('close', notification.id)">
          <font-awesome-icon :icon="['fal', 'times']" />
        </button>
        <div class="icon">
          <font-awesome-icon :icon="icon(notification.type)" />
        </div>
        <div class="content" v-html="notification.content" />
        <div class="error-id" v-if="notification.errorId && notification.type === 'error'">에러코드: '{{notification.errorId}}'</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    notifications: {
      type: Array,
      required: true,
    },
  },
  methods: {
    icon(type) {
      if (type === 'error') {
        return ['far', 'times-circle']
      } else {
        return ['far', 'bullseye-arrow']
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.notification-box {
  z-index: 100;
  position: fixed;
  right: 2em;
  bottom: 2em;
  display: flex;
  flex-direction: column;
  gap: 1em;

  .notification {
    width: 20em;
    height: 8em;
    padding: 2em 1.5em;
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.5em;
    border-radius: 1em;

    .close {
      position: absolute;
      top: 0.6em;
      right: 1em;
      color: $color-contrast;
      font: {
        size: 1em;
        weight: 400;
        family: 'Noto Sans KR', sans-serif;
      }
      cursor: pointer;
      background-color: transparent;
      border: none;
    }

    .icon {
      font-size: 2em;
      color: $color-contrast;
    }

    .content {
      font: {
        weight: 400;
        family: 'Noto Sans KR', sans-serif;
      }
      flex-grow: 1;
      color: $color-contrast;
    }

    .error-id {
      position: absolute;
      bottom: 1em;
      left: 1.5em;
      color: $color-contrast;
      font: {
        size: .75em;
        weight: 400;
        family: 'Noto Sans KR', sans-serif;
      }
    }

    &.default {
      background-color: $background-primary;
    }

    &.error {
      background-color: $background-error;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
