<template>
  <div class="main-page">
    <section class="main" :class="{ 'hover-out': !this.dottedMap.overItem }">
      <transition name="fade" mode="out-in">
        <dotted-map
          v-if="
            ['서울특별시', ...Object.values(dottedMap.seoul.table)].includes(
              dottedMap.overItem
            )
          "
          :map-data="dottedMap.seoul"
          :over="dottedMap.overItem"
          class="dotted-map"
        />
        <dotted-map
          v-else-if="
            [
              '경기도북부',
              ...Object.values(dottedMap.gyeonggi.north.table),
            ].includes(dottedMap.overItem)
          "
          :map-data="dottedMap.gyeonggi.north"
          :over="dottedMap.overItem"
          class="dotted-map"
        />
        <dotted-map
          v-else-if="
            [
              '경기도남부',
              ...Object.values(dottedMap.gyeonggi.south.table),
            ].includes(dottedMap.overItem)
          "
          :map-data="dottedMap.gyeonggi.south"
          :over="dottedMap.overItem"
          class="dotted-map"
        />
        <div v-else class="promotion">
          <h2>중개수수료 아끼고 인테리어하자!</h2>
          <h3>99만원 아파트 중개</h3>
          <p>매도인 수수료 0원, 매수인 수수료 99만원</p>
        </div>
      </transition>
      <selector
        class="selector"
        text="찾으시는 지역을 선택해주세요."
        :theme="!dottedMap.overItem ? 'white' : 'secondary'"
        :items="selectorItems"
        @overCategory="setOverItem"
      />
    </section>
    <transition
      @before-enter="feesBeforeEnter"
      @enter="feesEnter"
      :css="false"
      appear
    >
      <section class="fees">
        <div class="header">
          <h2>부동산 중개</h2>
          <h3>국내 최저가 중개수수료</h3>
        </div>
        <div class="content">
          <h4>아파트 매매가 <span>상관없이</span> 무조건</h4>
          <div class="item seller">
            <p>매도인 / 임대인</p>
            <div class="seller-source">
              <video
                muted
                playsinline
                autoplay
                poster="@/assets/image/seller-fees.jpg"
              >
                <source src="@/assets/video/seller-fees.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div class="item buyer">
            <p>매수인 / 임차인</p>
            <div class="buyer-source">
              <video
                muted
                playsinline
                autoplay
                poster="@/assets/image/buyer-fees.jpg"
              >
                <source src="@/assets/video/buyer-fees.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <transition
      @before-enter="brokerageBeforeEnter"
      @enter="brokerageEnter"
      :css="false"
      appear
    >
      <section class="brokerage">
        <div class="header">
          <h2>변호사 직접중개</h2>
          <h3>공인중개사 자격보유<br />부동산 전문변호사<br /> 직접 중개</h3>
        </div>
        <div class="card-box lawyer-card-box">
          <div class="card lawyer">
            <img src="@/assets/image/card-lawyer.png" alt />
            <span>확실한 매물검증</span>
          </div>
        </div>
        <div class="card-box paper-card-box">
          <div class="card paper">
            <img src="@/assets/image/card-paper.png" alt />
            <span>안전한 중개</span>
          </div>
        </div>
      </section>
    </transition>
    <transition
      @before-enter="mobileBeforeEnter"
      @enter="mobileEnter"
      :css="false"
      appear
    >
      <section class="mobile">
        <div class="header">
          <h2>부동산 중개</h2>
          <h3>국내 최저가 중개수수료</h3>
        </div>
        <div class="image-box map">
          <img class="map" src="@/assets/image/mobile-map.png" alt />
        </div>
        <div class="image-box detail">
          <img class="detail" src="@/assets/image/mobile-detail.png" alt />
        </div>
      </section>
    </transition>
    <transition
      @before-enter="lawyerBeforeEnter"
      @enter="lawyerEnter"
      :css="false"
      appear
    >
      <section class="lawyer">
        <div class="header">
          <h2>부동산 소송</h2>
          <h3>부동산 전문 변호사</h3>
        </div>
        <img class="registration" src="@/assets/image/registration.png" alt />
        <div class="text-box">
          공인중개사 자격,<br />부동산 전문 자격을<br />
          갖춘 전문 변호사 <span>에이파트</span>에서
        </div>
        <div class="banner"></div>
      </section>
    </transition>
  </div>
</template>

<script>
import Selector from '@/components/tool/Selector'
import Seoul from '@/assets/data/map/seoul'
import Gyeonggi from '@/assets/data/map/gyeonggi'
import DottedMap from '@/components/tool/DottedMap'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  name: 'MainPage',
  components: { DottedMap, Selector },
  created() {
    gsap.registerPlugin(ScrollTrigger)
  },
  data() {
    return {
      animation: {
        fees: [false, false],
      },
      dottedMap: {
        overItem: null,
        seoul: Seoul.getSeoul(),
        gyeonggi: {
          north: Gyeonggi.getNorthGyeonggi(),
          south: Gyeonggi.getSouthGyeonggi(),
        },
      },
      selectorItems: {
        서울특별시: Object.values(Seoul.getSeoulTable()).slice(1),
        경기도북부: Object.values(Gyeonggi.getNorthGyeonggiTable()).slice(1),
        경기도남부: Object.values(Gyeonggi.getSouthGyeonggiTable()).slice(1),
      },
    }
  },
  methods: {
    setOverItem(value) {
      this.dottedMap.overItem = value
    },
    feesBeforeEnter(el) {
      gsap.set(el.childNodes, {
        opacity: 0,
      })
      gsap.set(el.childNodes[0], {
        y: 100,
      })
    },
    feesEnter(el, done) {
      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top center',
        },
      })
      timeline.to(el.childNodes[0], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[1], {
        duration: 0.5,
        opacity: 1,
        ease: 'power1.out',
        onComplete: done,
      })
    },
    brokerageBeforeEnter(el) {
      gsap.set(
        [
          el.childNodes[0],
          el.childNodes[1].childNodes[0],
          el.childNodes[2].childNodes[0],
        ],
        {
          opacity: 0,
          y: 100,
        }
      )
      gsap.set(
        [el.childNodes[1].childNodes[0], el.childNodes[2].childNodes[0]],
        {
          height: 368,
        }
      )
    },
    brokerageEnter(el, done) {
      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top center',
        },
      })
      timeline.to(el.childNodes[0], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[1].childNodes[0], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'back.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[1].childNodes[0], {
        duration: 0.5,
        height: 'auto',
        ease: 'back.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[2].childNodes[0], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'back.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[2].childNodes[0], {
        duration: 0.5,
        height: 'auto',
        ease: 'back.out',
        onComplete: done,
      })
    },
    mobileBeforeEnter(el) {
      gsap.set(el.childNodes, {
        opacity: 0,
      })
      gsap.set(el.childNodes[0], {
        y: 100,
      })
      gsap.set(el.childNodes[1], {
        y: 95,
      })
      gsap.set(el.childNodes[2], {
        y: -95,
      })
    },
    mobileEnter(el, done) {
      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top center',
        },
      })
      timeline.to(el.childNodes[0], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to([el.childNodes[1], el.childNodes[2]], {
        duration: 0.5,
        opacity: 1,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to([el.childNodes[1], el.childNodes[2]], {
        duration: 0.5,
        y: 0,
        ease: 'back.out',
        onComplete: done,
      })
    },
    lawyerBeforeEnter(el) {
      gsap.set([el.childNodes[0], el.childNodes[1], el.childNodes[2]], {
        opacity: 0,
        y: 100,
      })
      gsap.set(el.childNodes[3], {
        width: 0,
      })
    },
    lawyerEnter(el, done) {
      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top center',
        },
      })
      timeline.to(el.childNodes[0], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[1], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[2], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        onComplete: done,
      })
      timeline.to(el.childNodes[3], {
        duration: 1,
        width: 1080,
        ease: 'power1.out',
        onComplete: done,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.main-page {
  padding: 0 0 10em;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10em;

  section {
    width: 1080px;
    padding: 1em;

    .header {
      padding: 0 1em;

      h2 {
        color: $color-primary;

        font: {
          size: 1.5em;
          weight: 500;
        }
      }

      h3 {
        font: {
          size: 3em;
          weight: 500;
        }
      }
    }

    &.main {
      width: auto;
      align-self: stretch;
      height: 780px;
      padding: 2%;

      display: flex;
      justify-content: space-between;
      align-items: center;

      background: {
        color: transparent;
        image: url(../assets/image/background_white.png);
        position: center;
        repeat: no-repeat;
        size: cover;
        blend-mode: multiply;
      }

      -webkit-transition: background 0.3s ease-in-out;
      transition: background 0.3s ease-in-out;

      &.hover-out {
        background: {
          color: #00000033;
          image: url(../assets/image/background_house.png);
        }
      }

      .dotted-map {
        flex-grow: 1;
      }

      .promotion {
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1em;

        color: $color-contrast;

        > * {
          text-shadow: 0 4px 4px #00000072;
        }

        h2 {
          margin: 3rem 0;
          font: {
            size: 4.5em;
            weight: 500;
          }
        }

        h3 {
          font: {
            size: 4em;
            weight: 500;
          }
        }

        p {
          font: {
            size: 2.25em;
            weight: 400;
          }
        }
      }

      .selector {
        margin: 5% 0;
        align-self: stretch;
      }
    }

    &.fees {
      display: flex;
      flex-direction: column;
      gap: 2em;

      .content {
        padding: 2em;

        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
        gap: 1em;

        border-radius: 20px;
        box-shadow: -16px 16px 32px #00000080;

        h4 {
          grid-column: 1 / 3;

          font: {
            size: 1.125em;
            weight: 400;
          }

          span {
            color: $color-primary;

            font: {
              weight: 500;
            }
          }
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;

          p {
            font: {
              size: 1.5em;
              weight: 500;
            }
          }
        }
      }
    }

    &.brokerage {
      height: 1000px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr;
      gap: 2em;

      .card-box {
        display: flex;
        justify-content: center;
        align-items: flex-start;

        &.lawyer-card-box {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;

          border-radius: 20px;
          box-shadow: -16px 16px 32px #00000080;

          background-color: #141414;

          &.lawyer {
            top: 2em;
          }

          &.paper {
            top: 13em;
          }

          span {
            padding: 3rem;

            text-align: center;
            color: $color-contrast;
            font: {
              size: 2.25em;
              weight: 500;
            }
          }
        }
      }
    }

    &.mobile {
      height: 1234px;
      display: grid;
      grid-template-columns: 1fr 1fr;

      .image-box {
        display: flex;
        justify-content: center;

        &.map {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
        }

        img {
          position: relative;

          &.map {
            top: 2em;

            align-self: flex-start;
          }

          &.detail {
            bottom: 2em;

            align-self: flex-end;
          }
        }
      }
    }

    &.lawyer {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr auto auto;
      gap: 2em;

      .header {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }

      .registration {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
      }

      .text-box {
        grid-column: 1 / 2;
        grid-row: 2 / 3;

        text-align: right;
        font: {
          size: 2em;
          weight: 500;
        }

        span {
          color: $color-primary;
        }
      }

      .banner {
        grid-column: 1 / 3;
        grid-row: 3 / 4;
        justify-self: center;

        width: 1080px;
        height: 438px;
        margin: 0 -1em;

        background: {
          image: url(../assets/image/banner-lawyer.jpg);
          position: center;
          repeat: no-repeat;
        }
      }
    }
  }
}
</style>
