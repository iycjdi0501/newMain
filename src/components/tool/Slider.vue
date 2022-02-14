<template>
  <div
      class="slider"
      ref="box"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
  >
    <div class="list" ref="list">
      <img :src="contents[contents.length - 1]" alt="room-image"/>
      <img
          v-for="content in contents"
          :key="content"
          :src="content"
          alt="room-image"
      />
      <img :src="contents[0]" alt="room-image"/>
    </div>
    <button class="prev" type="button" @click="prev" @touchstart.stop @touchmove.stop @touchend.stop>
      <font-awesome-icon :icon="['fal', 'chevron-left']"/>
    </button>
    <button class="next" type="button" @click="next" @touchstart.stop @touchmove.stop @touchend.stop>
      <font-awesome-icon :icon="['fal', 'chevron-right']"/>
    </button>
    <span>{{ focusIndex || contents.length }} / {{ contents.length }}</span>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      touch: {
        start: null,
        move: null,
        end: null,
        gap: 20
      },
      focusIndex: 1,
    }
  },
  methods: {
    touchStart(event) {
      this.touch.start = event.touches[0].clientX
      this.touch.move = this.touch.start
    },
    touchMove(event) {
      this.touch.move = event.touches[0].clientX - this.touch.start
      this.transform(this.focusIndex, this.touch.move)
    },
    touchEnd(event) {
      this.touch.end = event.changedTouches[0].clientX
      if (this.touch.end > this.touch.start + this.touch.gap) {
        this.prev()
      } else if (this.touch.end < this.touch.start - this.touch.gap) {
        this.next()
      } else {
        this.curr()
      }
    },
    transform(index, move = 0) {
      const width = this.$refs.box.clientWidth
      const list = this.$refs.list
      list.style.transform = `translate3d(-${index * width - move}px, 0, 0)`
    },
    prev() {
      if (--this.focusIndex <= 0) {
        this.focusIndex = this.contents.length
      }
      this.transform(this.focusIndex)
    },
    next() {
      if (++this.focusIndex >= this.contents.length) {
        this.focusIndex = 0
      }
      this.transform(this.focusIndex)
    },
    curr() {
      this.transform(this.focusIndex)
    }
  },
}
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  overflow-x: hidden;
  display: flex;
  justify-content: center;

  span {
    position: absolute;
    bottom: 3vw;
    padding: 0 0.625em;
    background-color: $background-modal;
    color: $color-contrast;
    border-radius: 1em;
  }

  button {
    align-self: center;
    position: absolute;
    background-color: transparent;
    border: none;
    color: $color-contrast;
    mix-blend-mode: difference;
    font-size: 3em;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &.prev {
      left: 3vw;
    }

    &.next {
      right: 3vw;
    }
  }

  .list {
    display: flex;
    align-items: center;
    transform: translateX(-100%);

    img {
      flex-shrink: 0;
      width: 100%;
      height: auto;
    }
  }
}
</style>
