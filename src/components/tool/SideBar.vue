<template>
  <div @scroll.prevent @wheel.prevent @touchmove.prevent class="side-bar">
    <div @click.self="$emit('close')" class="blank" />
    <transition
      appear
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div class="content" :class="position">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'SideBar',
  props: {
    position: {
      type: String,
      default: 'top',
    },
  },
  methods: {
    beforeEnter(el) {
      switch (this.position) {
        case 'top':
          gsap.set(el, {
            y: -100,
          })
          break
        case 'right':
          gsap.set(el, {
            x: 100,
          })
          break
        case 'bottom':
          gsap.set(el, {
            y: 100,
          })
          break
        case 'left':
          gsap.set(el, {
            x: -100,
          })
          break
        default:
          gsap.set(el, {
            x: 100,
          })
          break
      }
    },
    enter(el, done) {
      switch (this.position) {
        case 'top':
          gsap.set(el, {
            duration: 0.5,
            y: 0,
            onComplete: done,
          })
          break
        case 'right':
          gsap.set(el, {
            duration: 0.5,
            x: 0,
            onComplete: done,
          })
          break
        case 'bottom':
          gsap.set(el, {
            duration: 0.5,
            y: 0,
            onComplete: done,
          })
          break
        case 'left':
          gsap.set(el, {
            duration: 0.5,
            x: 0,
            onComplete: done,
          })
          break
        default:
          gsap.set(el, {
            duration: 0.5,
            x: 0,
            onComplete: done,
          })
          break
      }
    },
    leave(el, done) {
      switch (this.position) {
        case 'top':
          gsap.set(el, {
            duration: 0.5,
            y: -100,
            onComplete: done,
          })
          break
        case 'right':
          gsap.set(el, {
            duration: 0.5,
            x: 100,
            onComplete: done,
          })
          break
        case 'bottom':
          gsap.set(el, {
            duration: 0.5,
            y: 100,
            onComplete: done,
          })
          break
        case 'left':
          gsap.set(el, {
            duration: 0.5,
            x: -100,
            onComplete: done,
          })
          break
        default:
          gsap.set(el, {
            duration: 0.5,
            x: 100,
            onComplete: done,
          })
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.side-bar {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  overflow: hidden;
  z-index: 2;

  .blank {
    flex-grow: 1;
    background-color: $background-modal;
  }

  .content {
    background-color: $background-default;
    transition: 0.5s;

    &.top {
      width: 100%;
      position: absolute;
      top: 0;
      transform: translateY(-100%);
    }

    &.right {
      height: 100%;
      position: absolute;
      right: 0;
      transform: translateX(100%);
    }

    &.bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      transform: translateY(100%);
    }

    &.left {
      height: 100%;
      position: absolute;
      left: 0;
      transform: translateX(-100%);
    }
  }
}
</style>
