<template>
  <div class="selector" :class="theme">
    <div class="text">
      {{ text }}
    </div>
    <div class="list-view">
      <div
        class="categories-list"
        :style="{ transform: translate }"
        @mouseleave.self="$emit('overCategory', null)"
      >
        <div class="categories">
          <div
            class="category"
            v-for="(value, key, index) in items"
            :key="index"
            @click="selectCategory(key)"
            @mouseover="$emit('overCategory', key)"
          >
            {{ key }}
          </div>
        </div>
        <div class="categories">
          <div class="category previous" @click="goPrevious">돌아가기</div>
          <div
            class="category"
            v-for="(value, index) in array"
            :key="index"
            @click="serchKeyword(value)"
            @mouseover="$emit('overCategory', value)"
          >
            {{ value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    items: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      default: 'black',
      validator: function (value) {
        return ['black', 'white', 'primary', 'secondary'].indexOf(value) !== -1
      },
    },
  },
  data() {
    return {
      array: null,
      x_axis: 0,
    }
  },
  computed: {
    translate() {
      return `translate3d(-${this.x_axis}px, 0, 0)`
    },
  },
  methods: {
    serchKeyword(value) {
      this.$router.push({ name: 'SaleHouse', query: { keyword: `${value}` } })
    },
    selectCategory(key) {
      this.array = this.items[key].sort()
      this.x_axis += 170
    },
    goPrevious() {
      this.x_axis -= 170
    },
  },
}
</script>

<style lang="scss" scoped>
.selector {
  display: flex;
  flex-direction: column;
  align-items: center;

  &.black {
    .text {
      color: #000000;
    }
    .category {
      color: #000000;
      border: 2px solid #000000;

      &:hover {
        color: $color-contrast;
        background-color: #000000;
      }
    }
  }

  &.white {
    .text {
      color: $color-contrast;
    }
    .category {
      color: $color-contrast;
      border: 2px solid $color-contrast;

      &:hover {
        color: #000000;
        background-color: $color-contrast;
      }
    }
  }

  &.primary {
    .text {
      color: $color-primary;
    }
    .category {
      color: $color-primary;
      border: 2px solid $border-primary;

      &:hover {
        color: $border-contrast;
        background-color: $background-primary;
      }
    }
  }

  &.secondary {
    .text {
      color: $color-secondary;
    }
    .category {
      color: $color-secondary;
      border: 2px solid $border-secondary;

      &:hover {
        color: $border-contrast;
        background-color: $background-secondary;
      }
    }
  }

  .text {
    margin: 5% 0;
  }

  .list-view {
    display: flex;
    overflow: hidden;
    width: 170px;

    .categories-list {
      display: flex;
      transition: 0.3s;

      .categories {
        overflow: auto;
        margin: 0 10px;

        &::-webkit-scrollbar {
          display: none;
        }

        .category {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 150px;
          margin: 10% 0;
          height: 50px;
          border-radius: 15px;
          cursor: pointer;
          transition: 0.3s;
          font: {
            size: 1.2em;
          }
        }

        .previous {
          color: #ca6165;
          border: 2px solid $border-error;

          &:hover {
            border: 2px solid $border-contrast;
            color: $color-error;
          }
        }
      }
    }
  }
}
</style>
