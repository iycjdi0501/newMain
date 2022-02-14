<template>
  <modal
    v-if="modal.deleteId"
    class="modal delete-estate"
    @close="modal.deleteId = null"
    theme="naming"
    header="매물 삭제"
  >
    <div class="content">
      <strong>정말 매물을 삭제하시겠습니까?</strong>
      <p>매물을 삭제하게 되면 복구하실 수 없습니다.</p>
      <button @click="deleteMyEstate(modal.deleteId)">매물 삭제</button>
    </div>
  </modal>
  <modal
    v-if="modal.tradeId"
    class="modal trade-estate"
    @close="modal.tradeId = null"
    theme="naming"
    header="거래 완료"
  >
    <div class="content">
      <strong>매물이 거래되었나요?</strong>
      <p>거래완료 처리가 되면 거래완료 전으로 다시 설정하실 수 없습니다.</p>
      <button
        @click="
          completeTransaction({
            id: modal.tradeId,
          })
        "
      >
        거래 완료
      </button>
    </div>
  </modal>
  <div class="estate-list" v-if="realEstates.length">
    <router-link
      v-for="estate in realEstates"
      :key="estate._id"
      class="estate"
      :to="{ name: 'MyEstateDetail', params: { id: estate._id } }"
    >
      <div class="left-box">
        <image-filter :active="estate.traded" message="거래완료">
          <img :src="estate.roomImages[0]" alt="매물의 대표 사진" />
        </image-filter>
        <div class="info-box">
          <span class="stamp type">{{ estate.houseInfo.type }}</span>
          <div class="stamp-box">
            <div class="stamp brokerage">중개</div>
            <div v-if="estate.directTransaction" class="stamp direct">
              직거래
            </div>
          </div>
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
      <div class="right-box">
        <ul class="info-box">
          <li>등록번호 : {{ estate._id }}</li>
          <li>
            등록일자 : {{ moment(estate.createdAt).format('YYYY-MM-DD') }}
          </li>
          <li>조회수 : {{ estate.views }}</li>
          <li>찜 : {{ estate.wishListCount }}</li>
        </ul>
        <ul class="button-box">
          <li>
            <router-link
              :to="{ name: 'EstateUpdate', params: { id: estate._id } }"
            >
              수정
            </router-link>
          </li>
          <li>
            <button type="button" @click.prevent="modal.deleteId = estate._id">
              삭제
            </button>
          </li>
          <li>
            <button
              type="button"
              @click.prevent="modal.tradeId = estate._id"
              :disabled="estate.traded"
            >
              거래완료
            </button>
          </li>
        </ul>
      </div>
    </router-link>
    <paginate
      v-if="endPage"
      class="paginate"
      type="query"
      name="page"
      :current-page="page"
      :end-page="endPage"
    />
  </div>
  <div v-else class="none-data">등록된 집이 없습니다.</div>
</template>

<script>
import { amount } from '@/modules/tools'
import moment from 'moment'
import Paginate from '@/components/tool/Paginate'
import { errorHandler } from '@/modules/errorHandler'
import ImageFilter from '@/components/tool/ImageFilter'
import Modal from '@/components/tool/Modal'

export default {
  components: { Modal, ImageFilter, Paginate },
  props: {
    page: {
      type: Number,
    },
  },
  data() {
    return {
      modal: {
        deleteId: null,
        tradeId: null,
      },
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
    moment,
    amount,
    fetchPageData() {
      this.$store
        .dispatch('fetchMyEstatePages', this.page)
        .then((pageData) => this.setPageData(pageData))
        .catch((error) => {
          if (error.name === 'PageError') {
            if (error.validPage === this.page) {
              this.realEstates = []
            } else {
              this.$router.push({
                name: 'EstateList',
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
    deleteMyEstate(id) {
      this.$store
        .dispatch('deleteEstate', id)
        .then(() => {
          this.$store
            .dispatch('insertNotification', {
              content: '정상적으로 삭제되었습니다.',
            })
            .then(this.fetchPageData)
        })
        .catch(errorHandler)
      this.modal.deleteId = null
    },
    completeTransaction({ id }) {
      this.$store
        .dispatch('completeTransaction', { id })
        .then(() => {
          this.$store
            .dispatch('insertNotification', {
              content: '정상적으로 처리되었습니다.',
            })
            .then(this.fetchPageData)
        })
        .catch(errorHandler)
      this.modal.tradeId = null
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  &.delete-estate {
    .content {
      padding: 1em;

      display: flex;
      flex-direction: column;
      gap: 1em;

      strong {
        font-size: 1.25em;
        color: $color-error;
      }

      button {
        padding: 1em;
        border: none;

        background-color: $background-error;

        color: $color-contrast;

        font: {
          size: 1em;
          weight: 500;
        }

        cursor: pointer;
      }
    }
  }

  &.trade-estate {
    .content {
      padding: 1em;

      display: flex;
      flex-direction: column;
      gap: 1em;

      strong {
        font-size: 1.25em;
        color: $color-primary;
      }

      button {
        padding: 1em;
        border: none;

        background-color: $background-primary;

        color: $color-contrast;

        font: {
          size: 1em;
          weight: 500;
        }

        cursor: pointer;
      }
    }
  }
}

.estate-list {
  margin-top: -5em;
  display: flex;
  flex-direction: column;

  .estate {
    padding: 2em;
    display: flex;
    border-bottom: 1px solid $border-disable;
    text-decoration: none;
    color: $color-default;

    .left-box {
      width: 400px;
      padding-right: 2em;
      display: flex;
      gap: 2em;
      border-right: 1px solid $border-disable;

      .filter {
        width: 10em;
        height: 10em;
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
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;

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
    }

    .right-box {
      padding-left: 3em;
      display: flex;
      flex-grow: 1;
      justify-content: space-between;

      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        &.info-box {
          font-weight: 500;
        }

        &.button-box {
          li * {
            width: 6.25em;
            height: 2em;
            display: flex;
            justify-content: center;
            align-items: center;
            color: $color-contrast;
            background-color: $background-primary;
            border: none;
            text-decoration: none;
            cursor: pointer;
            font: {
              family: 'Noto Sans KR', sans-serif;
              weight: 400;
              size: 1em;
            }
          }

          button:disabled {
            background-color: $background-disable;
            color: $color-disable;
            cursor: not-allowed;
          }
        }
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
  .estate-list {
    margin-top: 0;
    gap: 1em;

    .estate {
      padding: 0.5em;
      border-bottom: none;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      display: flex;
      gap: 1em;
      font-size: 0.8em;

      .left-box {
        width: auto;
        padding-right: 0;
        gap: 0.5em;
        border-right: none;

        .filter {
          width: 10em;
          height: 10em;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .info-box {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;

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
      }

      .right-box {
        padding-left: 0;
        display: flex;
        flex-grow: 0;
        flex-direction: column;
        justify-content: space-between;
        font-size: 10px;
        gap: 1em;

        ul {
          display: flex;
          justify-content: space-around;

          &.info-box {
            flex-grow: 1;
            flex-direction: column;
            justify-content: space-between;
          }

          &.button-box {
            flex-direction: row;

            li * {
              width: 4em;
              height: 2em;
            }
          }
        }
      }
    }

    .paginate {
      align-self: center;
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
