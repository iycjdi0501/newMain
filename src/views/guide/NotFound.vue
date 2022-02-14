<template>
  <div class="not-found">
    <div class="wrapper">
      <img src="@/assets/image/404.png" alt="404" />
      <div class="text-box">
        <h3>요청하신 페이지를 찾지 못했습니다.</h3>
        <p>
          요청하신 페이지가 수정, 삭제되었거나<br />존재하지 않는 페이지입니다.
        </p>
      </div>
      <router-link :to="{ name: 'Main' }">메인으로</router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.not-found {
  padding: 17vh 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5em;

    .text-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2em;

      h3 {
        font: {
          weight: 400;
          size: 2.25em;
        }
      }

      p {
        text-align: center;
        color: $color-disable;
        font: {
          weight: 400;
          size: 1.125em;
        }
      }
    }

    a {
      padding: 1em 3em;
      border-radius: 7px;
      text-decoration: none;
      color: $color-contrast;
      background-color: $background-primary;
      font: {
        weight: 400;
        size: 1.5em;
      }
    }
  }
}
</style>
