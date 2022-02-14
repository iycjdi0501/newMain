<template>
  <div class="list-header">
    <div class="box-category" ref="box" v-if="isVisibleFilterList && !isMobile">
      <div class="category">
        <div
          :class="{ checked: sort === 'recommended' }"
          @click="$emit('update:sort', 'recommended')"
        >
          추천순
        </div>
        <div
          :class="{ checked: sort === 'latest' }"
          @click="$emit('update:sort', 'latest')"
        >
          최신순
        </div>
      </div>
      <div
        class="btn-filter"
        @click="$emit('update:isVisibleFilterList', !isVisibleFilterList)"
      >
        필터
      </div>
    </div>
    <div
      class="box-category"
      v-if="isVisibleFilterList && isMobile"
      @click="
        $emit('isVisibleSaleHouseList', !isVisibleSaleHouseList),
          (isVisibleSaleHouseList = !isVisibleSaleHouseList)
      "
    >
      <div class="line"></div>
      <div class="count">
        이 지역 매물 <span>{{ saleCount }}개</span>
      </div>
    </div>
    <div class="list-filter" v-if="!isVisibleFilterList && !isMobile">
      <header>
        <div>필터</div>
        <div class="btn-close">
          <font-awesome-icon
            :icon="['fas', 'times']"
            @click="$emit('update:isVisibleFilterList', !isVisibleFilterList)"
          />
        </div>
      </header>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sort: {
      type: String,
      required: true,
    },
    isVisibleFilterList: {
      type: Boolean,
      required: true,
    },
    isMobile: {
      type: Boolean,
    },
    saleCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isVisibleSaleHouseList: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.list-header {
  .box-category {
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    padding-left: 21px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #d6d6d6;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;

    .category {
      width: 24%;
      display: flex;
      justify-content: space-between;

      .checked {
        color: #000;
      }

      div {
        cursor: pointer;
        color: #999999;
      }
    }

    .btn-filter {
      margin-right: 20px;
      cursor: pointer;
    }
  }

  .list-filter {
    header {
      font-size: 1.15em;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
      padding: 11.5px 21px;
    }
  }
}
@media (max-width: 1024px) {
  .list-header {
    .box-category {
      height: 8vh;
      display: block;
      padding: 0;
      .line {
        width: 30px;
        margin: 8px auto 15px;
        border-bottom: 3px solid ;
        height: 1px;
      }
      .count {
        line-height: 18px;
        font-size: 18px;
        font-weight: 400;
        span {
          color: $color-primary;
        }
      }
    }
  }
}
</style>
