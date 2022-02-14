<template>
  <div v-if="inquiries.length" class="inquiry-list">
    <table>
      <colgroup>
        <col span="1" class="title" />
        <col span="1" class="date" />
        <col span="1" class="state" />
      </colgroup>
      <thead>
        <tr>
          <th>제목</th>
          <th>날짜</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inquiry in inquiries" :key="inquiry._id">
          <td class="title-data">
            <router-link
              :to="{ name: 'MyInquiryDetail', params: { id: inquiry._id } }"
            >
              {{ inquiry.title }}
            </router-link>
          </td>
          <td>{{ moment(inquiry.createdAt).format('YYYY-MM-DD hh:mm') }}</td>
          <td class="state-data" :class="{ complete: !!inquiry.answer }">
            {{ inquiry.answer ? '상담 완료' : '상담 대기중' }}
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <paginate
        v-if="endPage"
        class="paginate"
        type="query"
        name="page"
        :current-page="page"
        :end-page="endPage"
      />
      <router-link :to="{ name: 'InquiryForm' }">1:1 문의</router-link>
    </div>
  </div>
  <div v-else class="none-data">문의하신 내역이 없습니다.</div>
</template>

<script>
import moment from 'moment'
import Paginate from '@/components/tool/Paginate'

export default {
  components: { Paginate },
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
      inquiries: [],
    }
  },
  created() {
    this.fetchPageData()
  },
  methods: {
    moment,
    fetchPageData() {
      this.$store
        .dispatch('fetchMyInquiryPages', this.page)
        .then((pageData) => this.setPageData(pageData))
        .catch((error) => {
          if (error.name === 'PageError') {
            if (error.validPage === this.page) {
              this.inquiries = []
            } else {
              this.$router.push({
                name: 'InquiryList',
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
      this.inquiries = pageData.inquiries
    },
  },
}
</script>

<style lang="scss" scoped>
.inquiry-list {
  display: flex;
  flex-direction: column;

  table {
    table-layout: fixed;
    border-collapse: collapse;
    border-top: 2px solid $border-default;

    colgroup {
      .title {
        width: 60%;
      }

      .date {
        width: 22%;
      }

      .state {
        width: 18%;
      }
    }

    .state-data {
      color: $color-waiting;

      &.complete {
        color: $color-primary;
      }
    }

    th {
      font-weight: 400;
    }

    th,
    td {
      padding: 1em 3em;
      border-bottom: 1px solid $border-disable;
    }

    .title-data {
      a {
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: none;
        color: $color-default;
      }
    }

    tbody td:not(.title-data) {
      text-align: center;
    }
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1em 0;
    position: relative;

    > a {
      padding: 0.8em 3em;
      text-decoration: none;
      position: absolute;
      right: 0;
      background-color: $background-primary;
      color: $color-contrast;
      font: {
        weight: 400;
      }
    }
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
  .inquiry-list {
    padding: 1em;

    table {
      table-layout: fixed;
      border-collapse: collapse;
      border-top: 2px solid $border-default;

      colgroup {
        .title {
          width: auto;
        }

        .date {
          width: 6em;
        }

        .state {
          width: 5em;
        }
      }

      .state-data {
        color: $color-waiting;

        &.complete {
          color: $color-primary;
        }
      }

      th {
        font-weight: 500;
      }

      th,
      td {
        font-size: 0.6em;
        padding: 1em;
      }

      tbody td:not(.title-data) {
        text-align: center;
      }
    }

    > div {
      flex-direction: column;
      gap: 1em;
      font-size: 0.6em;

      > a {
        position: static;
        font: {
          weight: 400;
        }
      }
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
