<template>
  <div class="paginate">
    <router-link
      v-if="currentPage !== 1"
      class="arrow"
      :to="{ path: path, [type]: { [name]: 1 } }"
    >
      <font-awesome-icon :icon="['fal', 'chevron-double-left']" />
    </router-link>
    <router-link
      v-if="currentPage !== 1"
      class="arrow"
      :to="{ path: path, [type]: { [name]: pageSize * bundle } }"
    >
      <font-awesome-icon :icon="['fal', 'chevron-left']" />
    </router-link>
    <router-link
      v-for="page in pages"
      :key="page"
      :class="{ active: page === currentPage }"
      :to="{ path: path, [type]: { [name]: page } }"
    >
      {{ page }}
    </router-link>
    <router-link
      v-if="currentPage !== endPage"
      class="arrow"
      :to="{ path: path, [type]: { [name]: pageSize * (bundle + 1) + 1 } }"
    >
      <font-awesome-icon :icon="['fal', 'chevron-right']" />
    </router-link>
    <router-link
      v-if="currentPage !== endPage"
      class="arrow"
      :to="{ path: path, [type]: { [name]: endPage } }"
    >
      <font-awesome-icon :icon="['fal', 'chevron-double-right']" />
    </router-link>
  </div>
</template>

<script>
import { rangeArray } from '@/modules/tools'

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    endPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    path() {
      return location.pathname
    },
    bundle() {
      return Math.floor((this.currentPage - 1) / this.pageSize)
    },
    pages() {
      const firstPage = this.pageSize * this.bundle + 1
      let lastPage = this.pageSize * (this.bundle + 1)
      if (lastPage > this.endPage) {
        lastPage = this.endPage
      }
      return rangeArray(lastPage, firstPage)
    },
  },
}
</script>

<style lang="scss" scoped>
.paginate {
  margin: 1em;
  display: flex;
  gap: 0.5em;

  a {
    width: 2em;
    height: 2.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: $color-default;
    border: 1px solid $border-disable;
    font: {
      family: 'Roboto Light';
      weight: 400;
    }

    &.arrow {
      color: $color-disable;
    }

    &.active {
      background-color: $background-primary;
      color: $color-contrast;
    }
  }
}
</style>
