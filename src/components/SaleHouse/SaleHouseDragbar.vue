<template>
  <div class="content">
    <div class="title">{{ title }}</div>
    <div class="select">
      <div class="slider">
        <input
          type="range"
          ref="inputLeft"
          min="0"
          max="20"
          value="1"
          step="1"
        />
        <input
          type="range"
          ref="inputRight"
          min="0"
          max="20"
          value="20"
          step="1"
        />
        <div class="track">
          <div ref="range" class="range"></div>
          <div ref="btnLeft" class="thumb left"></div>
          <div ref="btnRight" class="thumb right"></div>
        </div>
        <div class="box-step">
          <div class="first">최소</div>
          <div class="step" v-for="(step, idx) in steps" :key="idx">
            {{ step }}
          </div>
          <div class="last">최대</div>
        </div>
        <div class="total">{{ total(dragBarlist[0], dragBarlist[1]) }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    steps: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
    dragBar: {
      type: String,
    },
  },
  data() {
    return {
      inputLeft: null,
      inputRight: null,
      range: null,
      btnLeft: null,
      btnRight: null,
      dragBarlist: [this.calculatePercent(0), this.calculatePercent(20)],
    }
  },
  mounted() {
    this.inputLeft = this.$refs.inputLeft
    this.inputRight = this.$refs.inputRight
    this.range = this.$refs.range
    this.btnLeft = this.$refs.btnLeft
    this.btnRight = this.$refs.btnRight

    this.inputLeft.addEventListener('input', this.setLeftValue, true)
    this.inputRight.addEventListener('input', this.setRightValue, true)

    this.$emit('update:dragBar', this.dragBarlist.join(','))
  },
  methods: {
    total(left, right) {
      if (left === 0 && right === 100000000) {
        return '전체'
      } else if (!left && right) {
        return right + ' 까지'
      } else if (left && right === 100000000) {
        return left + ' 부터'
      } else {
        return left + ' ~ ' + right
      }
    },
    setLeftValue(e) {
      const dragBar = e.target
      const { value, min, max } = dragBar

      if (this.inputRight.value - value < 2) {
        dragBar.value = +this.inputRight.value - 2
      }

      const percent = Math.floor(((dragBar.value - min) / (max - min)) * 20)
      this.dragBarlist[0] = this.calculatePercent(percent)

      this.btnLeft.style.left = `${percent * 5 - 3}%`
      this.range.style.left = `${percent * 5 - 3}%`

      this.$emit('update:dragBar', this.dragBarlist.join(','))
    },
    setRightValue(e) {
      const dragBar = e.target
      const { value, min, max } = dragBar

      if (value - this.inputLeft.value < 2) {
        dragBar.value = +this.inputLeft.value + 2
      }

      const percent = Math.floor(((dragBar.value - min) / (max - min)) * 20)
      this.dragBarlist[1] = this.calculatePercent(percent)

      this.btnRight.style.right = `${100 - percent * 5 - 3}%`
      this.range.style.right = `${100 - percent * 5 - 3}%`

      this.$emit('update:dragBar', this.dragBarlist.join(','))
    },
    calculatePercent(percent) {
      let money = 0
      for (let i = 0; i <= percent; i++) {
        switch (i) {
          case 0:
        }
        if (i === 0) {
          money = 0
        } else if (i < 20) {
          money += 200
        } else if (i <= 60) {
          money += 1000
        } else if (i <= 70) {
          money += 2000
        } else if (i <= 80) {
          money += 5000
        } else if (i < 100) {
          money += 10000
        } else {
          money = 100000000
        }
      }
      return money
    },
  },
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 1.15em;
  font-weight: 400;
  margin-bottom: 5%;
}

.select {
  display: flex;
  flex-wrap: wrap;
}

.slider {
  width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  .total {
    width: 100%;
    text-align: left;
    font-size: 2em;
    color: $color-primary;
    font-weight: 500;
    margin-bottom: 8%;
  }
}

.track {
  width: 350px;
  position: relative;
  width: 100%;
  height: 0.5rem;
  background-color: #bdc3c7;
  border-radius: 0.5rem;
}

.range {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-primary;
  border-radius: 0.5rem;
}

.thumb {
  position: absolute;
  top: 0;
  transform: translateY(-0.25rem);
  width: 1rem;
  height: 1rem;
  background-color: $color-contrast;
  border: 1px solid #999999;
  border-radius: 50%;
}

.left {
  left: 0;
}

.right {
  right: 0;
}

input {
  width: 360px;
  height: 10px;
  position: absolute;
  border: none;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
}

input::-webkit-slider-thumb {
  pointer-events: all;
  width: 350px;
  height: 1.5rem;
  cursor: pointer;
  appearance: none;
}

.box-step {
  margin-top: 1%;
  width: 110%;
  display: flex;
  justify-content: space-between;

  div {
    width: 10%;
    text-align: center;
  }

  .last,
  .first {
    position: relative;
  }

  .first {
    left: 1%;
    text-align: right;
  }

  .last {
    right: 1%;
  }
}
</style>
