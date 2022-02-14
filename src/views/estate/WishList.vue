<template>
  <div v-if="realEstates.length" class="wish-list">
    <div class="wrapper">
      <router-link
        v-for="estate in realEstates"
        :key="estate._id"
        class="estate"
        :to="{ name: 'EstateDetail', params: { id: estate._id } }"
      >
        <image-filter :active="estate.traded" message="거래완료">
          <img :src="estate.roomImages[0]" alt="매물의 대표 사진" />
        </image-filter>
        <div class="info-box">
          <div class="info-box">
            <span class="stamp">{{ estate.houseInfo.type }}</span>
            <h3>
              {{ estate.transactionInfo.type }}
              {{ amount(estate.transactionInfo) }}
            </h3>
            <div class="area">
              {{ estate.houseInfo.area.supply }}m<sup>2</sup>
            </div>
            <div class="address">{{ estate.locationInfo.addressName }}</div>
          </div>
        </div>
        <button class="wish" @click.prevent="unWish(estate._id)">
          <font-awesome-icon :icon="['fas', 'heart']" />
        </button>
      </router-link>
    </div>
    <paginate
      v-if="endPage"
      class="paginate"
      type="query"
      name="page"
      :current-page="page"
      :end-page="endPage"
    />
  </div>
  <div v-else class="none-data">
    찜한 집이 없습니다.<br />마음에 드는 집을 찜해보세요!
  </div>
</template>

<script>
import ImageFilter from '@/components/tool/ImageFilter'
import { amount } from '@/modules/tools'
import Paginate from '@/components/tool/Paginate'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'

export default {
  components: { Paginate, ImageFilter },
  props: {
    page: {
      type: Number,
    },
  },
  data() {
    return {
      firstPage: NaN,
      lastPage: NaN,
      endPage: NaN,
      realEstates: [],
    }
  },
  created() {
    this.fetchPageData()
  },
  methods: {
    amount,
    fetchPageData() {
      this.$store
        .dispatch('fetchMyWishPages', this.page)
        .then((pageData) => this.setPageData(pageData))
        .catch((error) => {
          if (error.name === 'PageError') {
            if (error.validPage === this.page) {
              this.realEstates = []
            } else {
              this.$router.push({
                name: 'WishList',
                query: { page: error.validPage },
              })
            }
          }
        })
    },
    setPageData(pageData) {
      this.firstPage = pageData.firstPage
      this.lastPage = pageData.lastPage
      this.endPage = pageData.endPage
      this.realEstates = pageData.realEstates
    },
    unWish(id) {
      this.$store
        .dispatch('unWishTheEstate', id)
        .then(() => {
          this.$store.dispatch('insertNotification', {
            content: '내 찜 목록에서 제거하였습니다.',
          })
          this.fetchPageData()
        })
        .catch((error) => errorHandler(error, ERROR_TYPE.WISHLIST))
    },
  },
}
</script>

<style lang="scss" scoped>
.wish-list {
  display: flex;
  flex-direction: column;

  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2em;

    .estate {
      position: relative;
      display: flex;
      text-decoration: none;
      color: $color-default;
      border: 1px solid $border-disable;

      .filter {
        width: 9em;
        height: 9em;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          position: absolute;
          object-fit: cover;
          object-position: center;
          mix-blend-mode: soft-light;
        }
      }

      .info-box {
        padding: 0 1em;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-start;
        flex-grow: 1;

        .stamp {
          padding: 0.2em 0.8em;
          color: $color-contrast;
          background-color: $background-primary;
          font: {
            weight: 500;
            size: 0.75em;
          }
        }

        h3 {
          font: {
            family: 'Noto Sans KR', sans-serif;
            weight: 400;
            size: 1.125em;
          }
        }

        .area {
          font-size: 0.875em;
        }

        .address {
          color: $color-disable;
          font: {
            weight: 400;
            size: 0.875em;
          }
        }
      }

      .wish {
        position: absolute;
        top: 1em;
        right: 1em;
        background-color: transparent;
        border: none;
        cursor: pointer;
        color: $color-heart;
      }
    }
  }

  .paginate {
    align-self: center;
    margin: 3em;
  }
}

.none-data {
  margin-bottom: 4em;
  text-align: center;
  font: {
    size: 1.5em;
    weight: 400;
  }
}
@media (max-width: 1024px) {
  .wish-list {
    .wrapper {
      grid-template-columns: 1fr;
      gap: 1em;

      .estate {
        border: none;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        padding: 0.5em;
        font-size: 0.9em;
      }
    }

    .paginate {
      margin: 3em;
      font-size: 0.6em;
    }
  }
  .none-data {
    margin-bottom: 2em;
    font: {
      size: 1em;
    }
  }
}
</style>
