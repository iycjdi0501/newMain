<template>
  <div class="policy_container">
    <div class="wrapper">
      <h2>서비스별 약관</h2>

      <div class="policy">
        <router-link
          :to="{ name: 'TermsOfUse' }"
          :class="{ path: pathName === 'TermsOfUse' }"
        >
          <div class="link">이용약관 동의</div>
        </router-link>
        <router-link
          :to="{ name: 'PrivacyPolicy' }"
          :class="{ path: pathName === 'PrivacyPolicy' }"
          ><div class="link">개인정보처리방침</div></router-link
        >
        <router-link
          :to="{ name: 'Marketing' }"
          :class="{ path: pathName === 'Marketing' }"
          ><div class="link">마케팅 정보 수신 동의</div></router-link
        >
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pathName() {

      return this.$route.name
    },
  },
}
</script>

<style lang="scss" scoped>
.policy_container {
  padding: 5em;
  background-color: $background-foundation;
  display: flex;
  justify-content: center;

  .wrapper {
    width: 1080px;
    padding: 3.5em;
    background-color: $background-default;

    h2 {
      margin: 0 0 3em;
    }
    .policy {
      width: 100%;
      display: flex;
      a {
        text-decoration: none;
        color: #767676;
        width: 50%;
        text-align: center;
        padding: 30px 0;
        font-size: 2em;
        border-bottom: 3px solid #767676;
        margin-bottom: 40px;
      }
      .path {
        border-bottom: 3px solid ;
        color: $color-primary;
        font-weight: 400;
      }
    }
  }
}

@media (max-width: 1024px) {
  .policy_container {
    padding: 0;
    .wrapper {
      padding: 2em 1em;
      h2{
        margin: 0 0 1em;
      }
      .policy {
        a {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
