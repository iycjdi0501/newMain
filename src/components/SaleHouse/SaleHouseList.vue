<template>
  <div
    class="list-container"
    :class="{ back: isMobile, filter: !isVisibleFilterList }"
    ref="container"
  >
    <sale-house-header
      v-model:sort="sort"
      :isVisibleFilterList="indicationVisibleFilterList"
      :isMobile="isMobile"
      :saleCount="totalHouseCount"
      @update:isVisibleFilterList="listVisibleEvent"
      @update:sort="$emit('update:sort', $event)"
      @isVisibleSaleHouseList="ListController"
      @mousedown="dragEvent"
      v-touch:drag="touchMove"
    />
    <div class="box-items" ref="items">
      <div class="content" ref="content" v-if="isVisibleFilterList">
        <div class="has" v-if="houseInfos.has === false">
          <div>
            <font-awesome-icon class="icon" :icon="['fal', 'times-circle']" />
          </div>
          <div>등록된 매물이 없습니다.</div>
        </div>
        <div class="box-info" v-else>
          <sale-house-items
            v-for="(house, idx) in houseInfos"
            :key="idx"
            :house="house"
            @coordinate="$emit('coordinate', $event)"
            @signIn="$emit('signIn', true)"
          />
        </div>
      </div>
      <div class="option-list" v-else>
        <div class="btn-box"></div>
        <sale-house-option
          :title="'집 종류'"
          :items="['아파트', '오피스텔']"
          v-model:itemList="filterDataSet.houseType"
          @update:itemList="houseType = $event ? $event.split(',') : null"
        />
        <sale-house-option
          :title="'거래 유형'"
          :items="['전세', '매매', '월세']"
          v-model:itemList="rentalType"
          @update:itemList="selectRentalType"
        />
        <sale-house-option
          v-if="houseType?.includes('원룸')"
          :title="'구조'"
          :items="['오픈형', '분리형', '복층']"
          v-model:itemList="filterDataSet.structure"
        />
        <!-- <sale-house-option
          v-if="
            filterDataSet.houseType?.includes('월세') ||
            filterDataSet.houseType?.includes('투룸') ||
            filterDataSet.houseType?.includes('쓰리룸')
          "
          :title="'층수'"
          :items="['지상', '반지하', '옥탑']"
          v-model:itemList="filterDataSet.floor"
        /> -->
        <div class="content-select" v-if="rentalType?.includes('전세')">
          <sale-house-price-range
            :title="'전세금'"
            v-model:priceSet="filterDataSet.rentalCost"
          />
        </div>
        <div class="content-select" v-if="rentalType?.includes('매매')">
          <sale-house-price-range
            :title="'매매가'"
            v-model:priceSet="filterDataSet.salePrice"
          />
        </div>
        <div class="content-select" v-if="rentalType?.includes('월세')">
          <sale-house-price-range
            :title="'월세 보증금'"
            v-model:price="filterDataSet.deposit"
          />
          <sale-house-price-range
            :title="'월세'"
            v-model:price="filterDataSet.monthlyRentCost"
          />
        </div>
        <div class="box-btn">
          <div @click="resetFilter()">초기화</div>
          <div @click="emitData()">적용</div>
        </div>
      </div>
    </div>
    <loading v-if="$store.state.sign.loading && !houseInfos.has && !isMobile && indicationVisibleFilterList" />
  </div>
</template>
<script>
import SaleHouseHeader from '@/components/SaleHouse/SaleHouseHeader'
import SaleHouseItems from '@/components/SaleHouse/SaleHouseItems'
import SaleHouseOption from '@/components/SaleHouse/SaleHouseOption'
import SaleHousePriceRange from '@/components/SaleHouse/SaleHousePriceRange'
import Loading from '@/components/tool/Loading'

export default {
  components: {
    SaleHouseHeader,
    SaleHouseItems,
    SaleHouseOption,
    SaleHousePriceRange,
    Loading,
  },
  props: {
    houseInfos: {
      type: Array,
      required: true,
    },
    requestable: {
      type: Boolean,
      required: true,
    },
    filterData: {
      type: Object,
    },
    isMobile: {
      type: Boolean,
    },
    isVisibleFilterList: {
      type: [Boolean, String],
    },
    mapHeight: {
      type: Number,
    },
    zoomChange: {
      type: Boolean,
    },
    totalHouseCount: {
      type: Number,
    },
  },
  data() {
    return {
      isVisibleSaleHouseList: false,
      requestableTimer: null,
      filterDataSet: this.filterData,
      sort: 'recommended',
      houseType: [],
      rentalType: [
        this.filterData.rentalCost ? '전세' : null,
        this.filterData.salePrice ? '매매' : null,
        this.filterData.deposit ? '월세' : null,
      ],
    }
  },
  mounted() {
    // 이벤트에 스크롤 이벤트를 걸어둔다.
    this.$refs.items.addEventListener('scroll', this.scrollEvent)
  },
  beforeUnmount() {
    // 페이지 렌더가 종료될때 스크롤 이벤트
    this.$refs.items.removeEventListener('scroll', this.scrollEvent)
  },
  computed: {
    indicationVisibleFilterList() {
      // 리스트가 보여질지 안보여질지 결정하는 메소드.

      // 매물리스트와 필터리스트가 false라면 리스트 controller를 끈다.
      if (!this.isVisibleSaleHouseList && !this.isVisibleFilterList) {
        this.ListController(!this.isVisibleFilterList)
      }
      // 필터를 종료하면 매물리스트가 보이도록 설정
      if (this.isVisibleFilterList === 'close') {
        this.ListController(false)
        this.$emit('update:isVisibleFilterList', true)
      }
      return this.isVisibleFilterList
    },
  },
  methods: {
    emitData() {
      // 검색 조건을 서버로 전송하면 매물이 보여야 하기때문에 필터리스트를 끈다.
      this.$emit('update:filterData', this.filterDataSet)
      this.$emit('update:isVisibleFilterList', !this.isVisibleFilterList)
    },
    resetFilter() {
      // 초기화 버튼을 누르면 검색 정보를 처음으로 되돌린다.
      this.$store.commit('RESET_FILTER')
      this.$emit('update:filterData', this.$store.state.sale.filterData)
      setTimeout(() => {
        this.filterDataSet = this.filterData
        this.rentalType = ['전세', '매매', '월세'].join(',')
      }, 100)
    },
    dragEvent() {
      // 마우스 이벤트. 리스트를 올리거나 내릴때 발동.
      window.addEventListener('mouseup', this.mouseUp())
    },
    touchMove(event) {
      if (this.isMobile) {
        this.$refs.container.style.height =
          this.mapHeight - event.changedTouches[0].clientY + 77 + 'px'
        if (event.changedTouches[0].clientY > this.mapHeight / 2) {
          this.ListController(true)
        } else {
          this.ListController(false)
        }
      }
    },
    mouseUp() {
      window.removeEventListener('mousemove', this.mouseMove)
      window.removeEventListener('mouseup', this.mouseUp)
      this.$refs.container.style.transition = '0.5s'
    },
    ListController(isVisibleSaleHouseList) {
      if (this.isMobile) {
        this.isVisibleSaleHouseList = isVisibleSaleHouseList
        const HEADER = window.document.querySelector('.header').clientHeight
        const SEARCH_BOX =
          window.document.querySelector('.box-search').clientHeight
        if (this.$refs.container && this.isMobile) {
          if (isVisibleSaleHouseList) {
            this.$refs.container.style.height = `calc(100% - ${
              HEADER + SEARCH_BOX
            }px)`
          } else {
            this.$refs.container.style.height = '8vh'
          }
        }
      }
    },
    selectRentalType() {
      if (!this.rentalType.includes('전세')) {
        delete this.filterDataSet.rentalCost
      }
      if (!this.rentalType.includes('월세')) {
        delete this.filterDataSet.deposit
        delete this.filterDataSet.monthlyRentCost
      }
      if (!this.rentalType.includes('매매')) {
        delete this.filterDataSet.salePrice
      }
      // this.$emit('update:filterData', this.filterDataSet)
    },
    listVisibleEvent(event) {
      if (event) {
        this.$refs.items.addEventListener('scroll', this.scrollEvent)
      } else {
        this.$refs.items.removeEventListener('scroll', this.scrollEvent)
      }

      this.setData()
      this.$emit('update:isVisibleFilterList', event)
    },
    setData() {
      this.filterDataSet = this.filterData
      this.rentalType = [
        this.filterData.rentalCost ? '전세' : null,
        this.filterData.salePrice ? '매매' : null,
        this.filterData.deposit ? '월세' : null,
      ]
    },
    scrollEvent(scroll) {
      if (!this.requestableTimer) {
        this.requestableTimer = true
        this.requestableTimer = setTimeout(() => {
          this.requestableTimer = null
          if (this.requestable) {
            this.scrollDone(scroll)
          }
        }, 500)
      }
    },
    scrollDone(scroll) {
      let height = scroll.target.clientHeight
      let scrollTop = scroll.target.scrollTop
      let contentHeight = this.$refs.content.clientHeight
      let scrollBottom = contentHeight - height - scrollTop
      if (scrollBottom < 500 && !this.zoomChange) {
        this.$parent.getSalehouseInfos()
      }
      if (!this.zoomChange) {
        this.$emit('update:zoomChange', false)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.check {
  border: 2px solid ;
  color: #000;
}

::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar-thumb {
  padding-top: 5%;
  border-radius: 50px;
  background: #a9a9a9;
  right: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

.has {
  height: 100%;
  color: #767676;
  text-align: center;
  margin-top: 95%;
  font-size: 1.4em;
  div {
    .icon {
      margin-bottom: 5%;
      font-size: 40px;
    }
  }
}
.back {
  background: $color-contrast;
}
.filter {
  padding-bottom: 35%;
}
.list-container {
  position: relative;
  font-size: 16px;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  user-select: none;
  width: 100%;
  height: 100%;
  .box-items {
    width: 100%;
    height: 100%;
    overflow-y: Overlay;
    padding-bottom: 50px;

    .option-list {
      background: #f5f5f5;
      padding-bottom: 1px;
      height: 100%;
      margin-bottom: 35%;
      .box-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        margin: 0 auto;
        bottom: 0;
        border-top: 1px solid #d6d6d6;
        padding: 10px 0;
        background: $color-contrast;
        div {
          width: 120px;
          margin: 0 8px;
          padding: 15px 0;
          text-align: center;
          background: $color-primary;
          border-radius: 15px;
          color: $color-contrast;
          font-weight: 400;
          cursor: pointer;
        }
      }
      .content-select {
        border-top: 1px solid #d6d6d6;
        background: $color-contrast;
        padding-top: 20px;
        padding-bottom: 5px;
        margin-bottom: 40px;

        > div {
          margin-left: 21px;
        }

        .title {
          font-size: 1.15em;
          font-weight: 400;
          margin-bottom: 1%;
        }

        .select {
          display: flex;
          flex-wrap: wrap;
        }
      }

      .dragbar {
        margin: 50px auto;
        position: relative;
        width: calc(100% - 100px);
        height: 10px;
        background: #222;
        border-radius: 5px;
      }

      .dragbar > .circle_01 {
        cursor: grab;
        position: absolute;
        left: 0;
        top: 50%;
        width: 30px;
        height: 30px;
        transform: translate(-50%, -50%);
      }

      .dragbar > .circle_01 > span {
        position: absolute;
        display: block;
        width: 30px;
        line-height: 30px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #2196f3;
        border-radius: 100%;
        text-align: center;
      }
    }
  }
}
@media (max-width: 1024px) {
  .list-container {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 8vh;
    bottom: 0;
    overflow: hidden;
    transition: 0.5s;
  }
  .has {
    margin-top: 20%;
  }
}
</style>
