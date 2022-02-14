<template>
  <div class="my">
    <div class="wrapper">
      <ul class="navigation">
        <li>
          <router-link :to="{ name: 'Account' }">계정 설정</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'EstateList' }">내 집 관리</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'WishList' }">찜 목록</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'InquiryList' }">문의 내역</router-link>
        </li>
      </ul>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.my {
  display: flex;
  justify-content: center;

  .wrapper {
    width: 1080px;

    .navigation {
      display: flex;
      list-style: none;
      margin: 5em 0;

      > li {
        width: 25%;

        > a {
          width: 100%;
          padding: 0.5em 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid $border-disable;
          text-decoration: none;
          color: $color-disable;
          font: {
            weight: 500;
            size: 1.5em;
          }

          &.router-link-exact-active {
            border-bottom: 2px solid $border-primary;
            color: $color-default;
          }
        }
      }
    }
  }
}
@media (max-width: 1024px) {
  .my {
    .wrapper {
      width: 100vw;

      .navigation {
        justify-content: space-evenly;
        margin: 2em 0;

        > li {
          width: 5em;

          > a {
            font: {
              size: 1em;
            }
          }
        }
      }
    }
  }
}
</style>
