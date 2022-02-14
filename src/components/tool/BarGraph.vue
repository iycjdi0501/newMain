<template>
  <div class="graph-wrapper" ref="graph">
    <div class="bar-container">
      <div
        v-for="(barData, index) in data"
        :key="index"
        class="bar-wrapper deactivate"
        :class="{
          highlight: barData.x_axis === options.highlight.target,
        }"
      >
        <div
          class="bar"
          :style="{
            backgroundColor: options.defaultColor,
            height: getHeight(barData.y_axis) + '%',
          }"
        >
          <div
            class="highlight_cover"
            :style="{
              backgroundColor: options.highlight.color,
            }"
          ></div>
          <div
            v-if="options.label.y_axis"
            class="y_axis-label"
            :style="{ top: getLabelPosition(getHeight(barData.y_axis)) + 'px' }"
          >
            {{ barData.y_axis + options.unit }}
          </div>
        </div>
        <div v-if="options.label.x_axis" class="x_axis-label">
          {{ barData.x_axis }}
        </div>
      </div>
    </div>
    <div class="x_axis-legend" v-if="options.legend.x_axis">
      {{ options.legend.x_axis }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getHeight(value) {
      return (value / this.maxFigure) * 90 + 1
    },
    getLabelPosition(height) {
      if (height > 20) {
        return 20
      } else {
        return -30
      }
    },
    scrollEvent() {
      if (
        this.$refs.graph.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        const bars = this.$refs.graph.querySelectorAll('.deactivate')
        bars.forEach((bar) => {
          if (bar.classList.contains('highlight')) {
            setTimeout(() => {
              bar.classList.remove('deactivate')
            }, 2000)
          } else {
            bar.classList.remove('deactivate')
          }
        })
      }
    },
  },
  computed: {
    maxFigure() {
      const array = []
      this.data.forEach((data) => {
        array.push(data.y_axis)
      })
      return Math.max(...array)
    },
  },
  created() {
    window.addEventListener('scroll', this.scrollEvent)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollEvent)
  },
}
</script>

<style lang="scss" scoped>
.graph-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .x_axis-legend {
    font: {
      size: 1.25em;
      weight: 600;
    }
  }

  .bar-container {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-around;
    border: {
      bottom: 2px solid $border-default;
    }

    .bar-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      position: relative;
      margin: 0 30px;

      .x_axis-label {
        position: absolute;
        bottom: -40px;
        font: {
          weight: 700;
        }
      }

      &.deactivate .bar {
        height: 0 !important;

        .y_axis-label {
          opacity: 0;
        }
      }

      .bar {
        transition: 2s;
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;

        .highlight_cover {
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        .y_axis-label {
          position: absolute;
          transition: 2s;
          font: {
            size: 0.9em;
            weight: 600;
          }
        }
      }

      &.highlight {
        color: $color-primary;

        .highlight_cover {
          opacity: 1;
        }

        .x_axis-label,
        .y_axis-label {
          font: {
            weight: 800;
          }
        }
      }
    }
  }
}
</style>
