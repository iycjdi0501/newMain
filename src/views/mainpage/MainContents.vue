<template>
  <div class="main-contents">
    <div class="inner">
      <div class="title">
        <b>에이파트</b><span class="recommend-sale"> 추천 매물 </span>
      </div>
      <div class="filter">
        <div class="left-filter">
          <div
            class="apart-button"
            @click="changeApart"
            v-bind:class="{ blue_btn: apart }"
          >
            아파트
          </div>
          <div
            class="office-button"
            @click="changeOffice"
            v-bind:class="{ blue_btn: !apart }"
          >
            오피스텔
          </div>
        </div>
        <div class="right-filter">
          <div class="left-cursor">
            <font-awesome-icon :icon="['fal', 'chevron-circle-left']" />
          </div>
          <div class="right-cursor">
            <font-awesome-icon :icon="['fal', 'chevron-circle-right']" />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="contents-container" :class="{ show: apart === true }">
          <div
            class="contents-box"
            v-for="(house, index) in houses"
            :key="house"
            :index="index"
          >
            <a
              :href="`https://a-part.co.kr/buyer/estate/${house._id}`"
              target="_blank"
            >
              <div>
                <img :src="house.roomImages[0]" alt="" class="contents-img" />
              </div>
              <div class="contents-title">
                {{ house.locationInfo.buildingName }}
              </div>
              <div class="contents-description">
                {{ house.transactionInfo.moveInType }} |
                {{ Math.ceil(house.houseInfo.area.supply / 3.3) }}평 |
                {{ calcHigh(house) }}
              </div>
              <div class="contents-type">{{ house.transactionInfo.type }}</div>
              <div class="contents-price">
                {{ amount(house.transactionInfo) }}
              </div>
            </a>
          </div>
        </div>

        <div class="contents-container" :class="{ show: apart === false }">
          <div
            class="contents-box"
            v-for="(house, index) in offices"
            :key="house"
            :index="index"
            @click="onClickRedirect(house)"
          >
            <a
              :href="`https://a-part.co.kr/buyer/estate/${house._id}`"
              target="_blank"
            >
              <div>
                <img :src="house.roomImages[0]" alt="" class="contents-img" />
              </div>
              <div class="contents-title">
                {{ house.locationInfo.buildingName }}
              </div>
              <div class="contents-description">
                {{ house.transactionInfo.moveInType }} |
                {{ Math.ceil(house.houseInfo.area.supply / 3.3) }}평 |
                {{ calcHigh(house) }}
              </div>
              <div class="contents-type">{{ house.transactionInfo.type }}</div>
              <div class="contents-price">
                {{ amount(house.transactionInfo) }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Main from '../../service/main.js'
import { errorHandler } from '../../modules/errorHandler'
import { amount } from '../../modules/tools'
export default {
  data() {
    return {
      datas: [
        '61dfd6fa5a8e909e038d3ae6',
        '61fcfd3de2db8d8a04618bfc',
        '61fcb020e2db8d8a046185b3',
        '61fcae73e2db8d8a04618537',
      ],
      office: [
        '61fc9c80e2db8d8a046181c2',
        '61fcc30de2db8d8a046187a8',
        '61dff5bb87e544edb01c5a9d',
        '61e0317587e544edb01c697b',
      ],
      houses: [],
      offices: [],
      apart: true,
    }
  },
  computed: {
    aroundArea(area) {
      return area
    },
  },
  created() {
    for (let i = 0; i < 4; i++) {
      Main.getHouseInfo(this.datas[i])
        .then(({ data }) => {
          this.houses.push(data)
          // console.log(data);
        })
        .catch(errorHandler)
    }
    for (let i = 0; i < 4; i++) {
      Main.getHouseInfo(this.office[i])
        .then(({ data }) => {
          this.offices.push(data)
          // console.log(data);
        })
        .catch(errorHandler)
    }
  },
  methods: {
    amount,
    calcHigh(data) {
      let relevantFloor = data.houseInfo.relevantFloor
      let buildingFloor = data.houseInfo.buildingFloor
      let flagHigh = buildingFloor / 3
      if (buildingFloor - relevantFloor < flagHigh) {
        return '고층'
      } else if (flagHigh * 2 >= buildingFloor - relevantFloor >= flagHigh) {
        return '중층'
      } else {
        return '저층'
      }
    },
    changeApart() {
      if (this.apart == false) {
        this.apart = true
      }
    },
    changeOffice() {
      if (this.apart == true) {
        this.apart = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  width: 100%;
  height: 600px;
  box-sizing: border-box;

  .inner {
    width: 1080px;
    height: 100%;
    margin: 0 auto;

    .title {
      font-size: 22px;
      margin-top: 60px;

      .recommend-sale {
        font-weight: 400;
      }
    }

    .filter {
      margin: 20px 0;
      width: 100%;
      height: 40px;
      display: flex;
      align-content: center;
      justify-content: space-between;

      .left-filter {
        width: 225px;
        height: 40px;
        display: flex;
        align-content: center;
        justify-content: space-between;
        font-size: 18px;
        font-weight: 400;

        .apart-button {
          width: 100px;
          height: 40px;
          border: 0.5px solid rgba(00, 00, 00, 0.7);
          border-radius: 10px;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
        }
        .office-button {
          width: 100px;
          height: 40px;
          border: 0.5px solid rgba(00, 00, 00, 0.7);
          border-radius: 10px;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
        }

        .blue_btn {
          color: #4e96ca;
          border: 0.5px solid #4e96ca;
        }

        .apart-button:hover,
        .office-button:hover {
          color: #4e96ca;
          border: 0.5px solid #4e96ca;
        }
      }

      .right-filter {
        width: 78px;
        height: 40px;

        display: flex;
        align-content: center;
        justify-content: space-between;
        position: relative;
        visibility: hidden;

        .left-cursor {
          color: black;
          font-size: 32px;
          line-height: 32px;
        }

        .right-cursor {
          color: black;
          line-height: 32px;
          font-size: 32px;
        }

        .left-cursor:hover,
        .right-cursor:hover {
          color: #4e96ca;
          border: 1px solid #4e96ca;
        }
      }
    }
    .content {
      position: relative;

      .contents-container {
        position: absolute;
        opacity: 0;
        top: 0;
        transition: 0.8s;
        z-index: -1;
        width: 100%;
        height: 350px;
        display: flex;
        align-content: center;
        justify-content: space-between;

        .contents-box {
          width: 250px;
          height: 350px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.35);
          transition: all 0.5s;
          cursor: pointer;

          a {
            color: black;

            .contents-img {
              width: 100%;
              height: 200px;
              border-radius: 10px;
            }

            .contents-title {
              width: 100%;
              height: 20px;
              margin-top: 5px;
              font-size: 18px;
              font-weight: 400;
              padding-left: 10px;
            }

            .contents-description {
              width: 100%;
              height: 15px;
              margin-top: 10px;
              padding-left: 10px;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.7);
            }

            .contents-type {
              width: 100%;
              height: 24px;
              font-size: 24px;
              font-weight: bold;
              padding-left: 10px;
              margin-top: 15px;
            }

            .contents-price {
              width: 100%;
              height: 45px;
              padding-left: 10px;
              margin-top: 15px;
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
        .contents-box:hover {
          transform: scale(1.05);
        }
      }
      .show {
        opacity: 1 !important;
        z-index: 0;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
