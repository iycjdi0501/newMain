<template>
  <div class="footer">
    <div class="top-box">
      <img
        class="logo"
        src="@/assets/logo/svg/Logo_Text-en_Row.svg"
        alt="A-Part logo"
      />
      <ul>
        <li>
          <router-link :to="{ name: 'TermsOfUse' }"> 이용약관</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'PrivacyPolicy' }">
            개인정보처리방침
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Marketing' }">
            마케팅 정보 수신 동의
          </router-link>
        </li>
      </ul>
    </div>
    <div class="bottom-box">
      <ul>
        <li>
          <span>㈜에이파트부동산중개법인</span>|<span>대표: 유익상</span>|<span
            >사업자등록번호: 837-88-02276</span
          >
        </li>
        <li>주소: 서울특별시 송파구 백제고분로 365, 9층(석촌동)</li>
        <li>이메일 : m-apart@naver.com</li>
        <li>전화번호: 070-7773-1193</li>
        <li>고객센터: 02-2203-0508</li>
      </ul>
      <div class="copyright">&copy; 2021 에이파트. All rights reserved.</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;

  .top-box {
    position: relative;
    padding: 2% 0;
    border: {
      top: 1px solid $border-disable;
      bottom: 1px solid $border-disable;
    }

    .logo {
      position: absolute;
      left: 15%;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 50px;
      width: auto;
    }

    ul {
      display: flex;
      justify-content: center;
      list-style-type: none;

      li {
        margin: 0 2%;
        font: {
          size: 1.2em;
        }

        a {
          text-decoration: none;
          color: $color-default;
        }
      }
    }
  }

  .bottom-box {
    position: relative;
    padding: 1% 0;
    text-align: center;

    ul {
      list-style-type: none;

      li {
        margin: 0.5% 0;
        font: {
          size: 0.9em;
        }

        &:first-child {
          > * {
            margin: 0 1%;
          }
        }
      }
    }

    .copyright {
      margin: 1% 0;
      color: $color-disable;
      font: {
        size: 0.9em;
        weight: 400;
      }
    }
  }
}

@media (max-width: 1024px) {
  .footer {
    margin-bottom: 2em;

    .top-box {
      padding: 1em;

      .logo {
        position: static;
        margin: 0;
        height: 1.5em;
        display: block;
        margin: 0 auto 5%;
      }

      ul {
        li {
          font: {
            size: 0.8em;
          }
        }
      }
    }

    .bottom-box {
      position: relative;
      padding: 1% 0;
      text-align: center;

      ul {
        li {
          font: {
            size: 0.7em;
          }

          &:first-child {
            > * {
              margin: 0 1%;
            }
          }
        }
      }

      .copyright {
        margin: 1% 0;
        color: $color-disable;
        font: {
          size: 0.7em;
          weight: 400;
        }
      }
    }
  }
}
</style>
