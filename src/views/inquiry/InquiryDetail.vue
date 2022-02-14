<template>
  <div v-if="inquiry" class="inquiry-detail">
    <div class="wrapper">
      <div class="inquiry-box">
        <div class="category-state">
          <div class="category-box">
            <label>문의유형</label>
            <span>{{ inquiry.category }}</span>
          </div>
          <div class="state-box">
            <label>상태</label>
            <span :class="{ complete: !!inquiry.answer }">
              {{ inquiry.answer ? '상담 완료' : '상담 대기중' }}
            </span>
          </div>
        </div>
        <div class="date-box">
          <label>날짜</label>
          <span>{{
            moment(inquiry.createdAt).format('YYYY-MM-DD hh:mm')
          }}</span>
        </div>
        <div class="title-box">
          <label>제목</label>
          <span>{{ inquiry.title }}</span>
        </div>
        <div class="description-box">
          <label>내용</label>
          <span>
            <div>
              {{ inquiry.description }}
            </div>
            <img
              v-for="image in inquiry.attachedImages"
              :key="image"
              :src="image"
            />
          </span>
        </div>
        <div v-if="inquiry.answer" class="answer-box">
          <label>답변</label>
          <span v-html="inquiry.answer.description"></span>
        </div>
      </div>
      <div class="button-box">
        <router-link :to="{ name: 'InquiryForm' }" class="again">
          다시 문의하기
        </router-link>
        <router-link :to="{ name: 'InquiryList' }" class="to-list">
          목록으로
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import moment from 'moment'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      inquiry: null,
    }
  },
  created() {
    this.fetchInquiry()
  },
  methods: {
    moment,
    async fetchInquiry() {
      this.inquiry = await this.$store
        .dispatch('fetchMyInquiry', this.id)
        .catch((error) => errorHandler(error, ERROR_TYPE.PAGINATION))
    },
  },
}
</script>

<style lang="scss" scoped>
.inquiry-detail {
  padding: 5em 1em;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    width: 960px;

    .inquiry-box {
      border-top: 2px solid $border-default;
      border-bottom: 2px solid $border-default;

      > div {
        padding: 2em;
        display: flex;

        &.category-state {
          > div {
            display: flex;
          }

          .category-box {
            width: 60%;
          }

          .state-box {
            width: 40%;

            > span {
              color: $color-waiting;

              &.complete {
                color: $color-primary;
              }
            }
          }
        }

        &.description-box {
          span {
            img {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
              padding: 1em;
            }
          }
        }

        label {
          flex-shrink: 0;
          width: 8em;
          font: {
            weight: 400;
          }
        }

        &:not(&:last-child) {
          border-bottom: 1px solid $border-disable;
        }
      }
    }

    .button-box {
      margin: 4em;
      display: flex;
      justify-content: center;
      gap: 1.5em;

      a {
        width: 10em;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        font: {
          weight: 400;
          size: 1.125em;
        }

        &.again {
          border: 1px solid $border-primary;
          color: $color-primary;
        }

        &.to-list {
          border: 1px solid $border-contrast;
          color: $color-contrast;
          background-color: $background-primary;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .inquiry-detail {
    padding: 2em 1em;

    .wrapper {
      width: 100%;

      .inquiry-box {
        > div {
          padding: 1em;
          display: flex;

          &.category-state {
            display: flex;
            flex-direction: column;
            gap: 1em;

            > div {
              display: flex;
            }

            .category-box {
              width: auto;
            }

            .state-box {
              width: auto;
            }
          }

          label {
            width: 5em;
          }
        }
      }

      .button-box {
        margin: 2em 0;
        align-items: center;
        flex-direction: column;
        gap: 1em;

        a {
          font: {
            size: 0.9em;
          }
        }
      }
    }
  }
}
</style>
