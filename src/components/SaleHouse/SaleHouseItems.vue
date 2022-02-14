<template>
  <div
    class="item"
    @mouseover="emitCoordinate(house.locationInfo.coordinate)"
    @mouseout="$emit('coordinate', 0)"
    @click="openUrl(house._id)"
  >
    <image-filter
      class="image-filter"
      :active="house.traded"
      message="거래완료"
    >
      <img :src="house.roomImages[0]" alt="방 이미지" />
    </image-filter>
    <div class="info" v-if="house">
      <div class="box-category">
        <div class="stamp type">{{ house.houseInfo.type }}</div>
        <font-awesome-icon
          class="true-wished"
          :icon="['fas', 'heart']"
          v-if="wished"
          @click="checkWish($event, house._id)"
        />
        <font-awesome-icon
          class="no-wished"
          :icon="['fal', 'heart']"
          v-else
          @click="checkWish($event, house._id)"
        />
      </div>
      <div class="stamp-box">
        <div class="stamp brokerage" @click="asd(house)">중개</div>
        <div v-if="house.directTransaction" class="stamp direct">직거래</div>
      </div>
      <div class="building-name">
        {{ house.locationInfo.buildingName || '' }}
      </div>
      <div class="price">
        {{ house.transactionInfo.type }}
        {{ typePrice(house.transactionInfo.type) }}
      </div>
      <div class="area">{{ house.houseInfo.area.supply }}m²</div>
      <div class="address">{{ house.locationInfo.addressName || '' }}</div>
    </div>
    <modal v-if="modal" @close="modal = false">
      <div class="notification">자신의 매물은 찜할 수 없습니다.</div>
    </modal>
  </div>
</template>
<script>
import Modal from '@/components/tool/Modal'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import ImageFilter from '@/components/tool/ImageFilter'

export default {
  components: { Modal, ImageFilter },
  props: {
    house: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      wished: this.house.isWished,
      modal: false,
    }
  },
  methods: {
    emitCoordinate(coordinateInfo) {
      let coordinate = `${coordinateInfo.longitude},${coordinateInfo.latitude}`
      this.$emit('coordinate', coordinate)
    },
    openUrl(id) {
      window.open(`/buyer/estate/${id}`)
    },
    priceFormatting(data) {
      let result, unit
      data = String(data)
      if (data.length > 4) {
        unit = parseInt(data / 10000)
        data = data - unit * 10000
      }
      if (!unit) {
        result = data
      } else if (data !== 0) {
        result = unit + '억 ' + data
      } else {
        result = unit + '억'
      }
      return result
    },
    typePrice(type) {
      let info = this.house.transactionInfo
      if (type === '월세') {
        return this.priceFormatting(info.deposit) + '/' + info.monthlyRentCost
      }
      if (type === '전세') {
        return this.priceFormatting(info.rentalCost)
      }
      if (type === '매매') {
        return this.priceFormatting(info.salePrice)
      }
    },
    formatting(data) {
      return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    checkWish(event, id) {
      event.stopPropagation()
      if (!this.wished) {
        this.$store
          .dispatch('wishTheEstate', id)
          .then(() => {
            this.$store.dispatch('insertNotification', {
              content: '내 찜 목록에 추가하였습니다.',
            })
            this.wished = true
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.WISHLIST))
      } else {
        this.$store
          .dispatch('unWishTheEstate', id)
          .then(() => {
            this.$store.dispatch('insertNotification', {
              content: '내 찜 목록에서 제거하였습니다.',
            })
            this.wished = false
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.WISHLIST))
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.notification {
  font-size: 1.3em;
  font-weight: 400;
}

.item {
  width: 100%;
  height: 10.85em;
  border: 1px solid #d6d6d6;
  display: flex;

  .image-filter {
    width: 47%;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      mix-blend-mode: soft-light;
    }
  }

  cursor: pointer;

  .info {
    width: 53%;
    padding: 8px 0 9px 10px;
    flex-grow: 1;
    & > div{ 
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .building-name {
      width: 10em;
      font-size: 1.13em;
      font-weight: 400;
      margin-bottom: 0.1em;
    }

    .stamp {
      width: 5em;
      padding: 0.125em;
      color: $color-contrast;
      text-align: center;
      font-size: 0.75em;
      font-weight: 400;
      margin-bottom: 0.3em;

      &.type {
        background-color: $background-primary;
      }

      &.brokerage {
        background-color: $background-point-green;
      }

      &.direct {
        background-color: $background-point-pink;
      }
    }
    .stamp-box {
      display: flex;
      gap: 0.3em;
    }

    .box-category {
      display: flex;
      justify-content: space-between;

      .no-wished,
      .true-wished {
        margin-right: 5%;
        font-size: 24px;
      }

      .true-wished {
        color: #c61400;
      }
    }

    .title,
    .price {
      width: 10em;
      font-size: 1.125em;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.1em;
    }

    .area {
      font-size: 0.9em;
      margin-bottom: 0.6em;
    }

    .address {
      color: #999999;
    }
  }
}

@media screen and (max-width: 1024px) {
  .item {
    width: 100%;
    .image-filter {
      img {
        mix-blend-mode: normal;
      }
    }
  }
}
</style>
