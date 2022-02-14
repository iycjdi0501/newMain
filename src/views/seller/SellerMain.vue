<template>
  <div class="seller-main">
    <div class="banner">
      <div class="banner-text">
        부동산전문변호사의 99만원 중개!<br />중개없이 직거래도 가능!
      </div>
      <div class="banner-link">
        <router-link :to="{ name: 'SellerForm' }">직접 집 내놓기</router-link>
        <router-link :to="{ name: 'SellerCall' }">전화로 집 내놓기</router-link>
      </div>
    </div>
    <div class="advantage">
      <div class="text-box">
        편리한데 안전하기 까지한 <br /><b>부동산 중개</b>
      </div>
      <div class="advantage-item">
        <advantage-item
          v-for="(item, index) in advantage"
          :key="index"
          :title="item.title"
          :description="item.description"
        >
          <font-awesome-icon
            :icon="[item.iconType, item.icon]"
          ></font-awesome-icon>
        </advantage-item>
      </div>
    </div>
    <div class="steps">
      <div class="text-box">쉬운 매물 등록부터 매매까지</div>
      <div class="steps-content">
        <div class="circle">
          <steps-item
            v-for="(step, index) in steps"
            :key="index"
            :index="index + 1"
            :title="step.title"
            :description="step.description"
            class="step"
            :class="step.position"
          ></steps-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdvantageItem from '@/components/item/AdvantageItem'
import StepsItem from '@/components/item/StepsItem'

export default {
  components: { StepsItem, AdvantageItem },
  data() {
    return {
      advantage: [
        {
          iconType: 'fal',
          icon: 'coins',
          title: '매도인',
          description: `중개수수료 <b style="color: $color-primary; font-size: 2em">0</b>원`,
        },
        {
          iconType: 'fad',
          icon: 'laptop-house',
          title: '온라인',
          description: `온라인으로 간편하게<br>집을 내놓으세요!`,
        },
        {
          iconType: 'fal',
          icon: 'handshake',
          title: '안정성',
          description: `변호사가 직접<br>고객님의 집을 중개합니다.`,
        },
      ],
      steps: [
        {
          position: 'lt',
          title: '매물 등록',
          description: '고객님의 매물을<br>온라인으로 등록해주세요!',
        },
        {
          position: 'rt',
          title: '매물 확인',
          description: '변호사가<br>직접 매물을 확인합니다.',
        },
        {
          position: 'lb',
          title: '매물 중개',
          description: '에이파트에서 고객님의<br>매물을 직접 중개합니다.',
        },
        {
          position: 'rb',
          title: '매물 거래',
          description:
            '변호사의 중개하에 고객님의<br>매물을 안전하게 거래합니다.',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.seller-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10em;
  padding-bottom: 10em;

  .banner {
    width: 100%;
    height: 680px;
    padding: 5em 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5em;
    text-align: center;

    background: {
      blend-mode: multiply;
      color: $background-filter;
      image: url(../../assets/image/Background_labtop.png);
      repeat: no-repeat;
      position: bottom;
      size: cover;
    }

    .banner-text {
      color: $color-contrast;
      font: {
        size: 3em;
        weight: 500;
      }
    }

    .banner-link {
      align-self: stretch;
      display: flex;
      justify-content: center;
      gap: 4em;

      a {
        width: 9em;
        height: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border: 3px solid $border-contrast;
        border-radius: 0.4em;
        color: $color-contrast;
        text-decoration: none;
        transition: 0.3s;
        font: {
          size: 2em;
        }

        &:hover {
          border: 3px solid $border-primary;
        }
      }
    }
  }

  > div {
    width: 1080px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3em;

    &.advantage {
      .text-box {
        text-align: center;
        font: {
          size: 3em;
          weight: 300;
        }

        b {
          font: {
            weight: 500;
          }
        }
      }

      .advantage-item {
        align-self: stretch;
        display: flex;
        justify-content: space-between;

        > * {
          width: 270px;
        }
      }
    }

    &.steps {
      .text-box {
        text-align: center;
        font: {
          size: 3em;
          weight: 400;
        }
      }

      .steps-content {
        position: relative;
        width: 700px;
        aspect-ratio: 10 / 9;
        display: flex;
        justify-content: center;
        align-items: center;

        .circle {
          width: 55%;
          aspect-ratio: 1 / 1;
          border: 15px solid $border-primary;
          border-radius: 50%;
        }

        .step {
          position: absolute;

          &.lt {
            left: 0;
            top: 0;
          }

          &.rt {
            right: 0;
            top: 0;
          }

          &.lb {
            left: 0;
            bottom: 0;
          }

          &.rb {
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .seller-main {
    gap: 5em;
    padding-bottom: 5em;

    .banner {
      height: auto;
      padding: 1em;
      gap: 1em;

      .banner-text {
        font: {
          size: 1.3em;
          weight: 500;
        }
      }

      .banner-link {
        width: auto;
        align-self: stretch;
        padding: 0 18%;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;

        a {
          padding: 0.5em;
          font: {
            size: 1em;
            weight: 400;
          }

          &:hover {
            border: 3px solid $border-primary;
          }
        }
      }
    }

    > div {
      width: 100vw;
      gap: 1em;

      &.advantage {
        .text-box {
          font: {
            size: 1.8em;
          }
        }

        .advantage-item {
          align-self: stretch;
          display: flex;
          flex-direction: column;
          align-items: center;

          > * {
            width: auto;
          }
        }
      }

      &.steps {
        .text-box {
          font: {
            size: 1.8em;
          }
        }

        .steps-content {
          position: static;
          width: auto;
          aspect-ratio: auto;
          display: flex;
          justify-content: center;
          align-items: center;

          .circle {
            width: auto;
            aspect-ratio: auto;
            border: none;
            border-radius: 0;
          }

          .step {
            position: static;
            margin: 3em 0;
          }
        }
      }
    }
  }
}
</style>
