<template>
  <modal
    class="modal"
    v-if="modalImage && !isMobile"
    @close="modalImage = false"
  >
    <div class="modal-image">
      <div class="focus-box">
        <span
          v-if="estate.roomImages.length > 2"
          class="arrow"
          @click="
            focusIndex =
              focusIndex - 1 < 0
                ? focusIndex - 1 + estate.roomImages.length
                : focusIndex - 1
          "
        >
          <font-awesome-icon :icon="['fal', 'chevron-left']" />
        </span>
        <div class="main-image">
          <img
            class="focus"
            :src="estate.roomImages[focusIndex]"
            alt="포커스 이미지"
          />
        </div>
        <span
          v-if="estate.roomImages.length > 2"
          class="arrow"
          @click="
            focusIndex =
              focusIndex + 1 >= estate.roomImages.length
                ? focusIndex + 1 - estate.roomImages.length
                : focusIndex + 1
          "
        >
          <font-awesome-icon :icon="['fal', 'chevron-right']" />
        </span>
      </div>
      <div class="list" v-if="estate.roomImages.length > 1">
        <img
          v-for="(image, index) in focusImages"
          :key="image + index"
          alt
          :src="image"
          :class="{
            'focus-image': index === focusIndex || index === focusIndex - 5,
          }"
          @click="focusIndex = estate.roomImages.indexOf(image)"
        />
      </div>
    </div>
  </modal>
  <modal
    class="modal"
    v-if="modalReport"
    @close="modalReport = false"
    header="신고하기"
    theme="naming"
  >
    <form class="modal-report" @submit.prevent="postInquiry">
      <div class="input-box">
        <base-select
          label="신고사유"
          theme="fixed-label"
          :options="report.options"
          place-holder="선택하세요."
          v-model="report.form.category"
        />
        <base-input
          label="제목"
          theme="fixed-label"
          minlength="2"
          maxlength="50"
          v-model="report.form.title"
        />
        <base-textarea
          label="신고내용"
          theme="fixed-label"
          minlength="1"
          maxlength="500"
          v-model="report.form.description"
        />
        <div class="file-input">
          <span class="label">파일첨부</span>
          <component
            class="file-box"
            for="file"
            :is="report.form.attachedImages.length < 5 ? 'label' : 'span'"
          >
            <div v-for="(name, index) in report.fileNames" :key="name">
              <span><font-awesome-icon :icon="['fal', 'images']" /></span>
              <span
                v-if="report.regex.test(report.form.attachedImages[index])"
                >{{ name }}</span
              >
              <spinner v-else class="spinner" />
              <span @click.prevent="removeImage(index)">
                <font-awesome-icon :icon="['fal', 'times']" />
              </span>
            </div>
          </component>
          <input
            type="file"
            id="file"
            accept=".jpg, .png, .jpeg, .jfif"
            @change="insertFile"
          />
        </div>
      </div>
      <ul>
        <li ref="caution">
          사진은 확장자는 jpg, png, jpeg, jfif만 지원하며 5MB 이내,<br />5개
          까지 첨부 가능합니다.
        </li>
        <li>
          제목은 최소 2자 이상 최대 50자 이내로 작성하실 수 있으며,<br />
          내용은 최소 1자 이상 최대 500자 이내로 작성하실 수 있습니다.
        </li>
        <li>허위 매물 등 각종 버그나 부적절한 게시글을 신고해 주세요.</li>
        <li>동일한 매물에 대한 신고는 24시간에 1회로 제한됩니다.</li>
        <li>
          의도적으로 게시글을 지속 신고하는 행위는 활동에 제한이<br />생길 수
          있습니다.
        </li>
      </ul>
      <tool-tip class="submit-box" :messages="errorMessages" theme="error">
        <base-button
          type="submit"
          :disabled="!!errorMessages.length"
          @submit.prevent
        >
          신고하기
        </base-button>
      </tool-tip>
    </form>
  </modal>
  <modal
    class="modal"
    v-if="modalTel"
    @close="modalTel = false"
    header="연락처"
    theme="naming"
  >
    <div class="modal-tel">
      <div class="content">
        <span class="seller-info">
          <span class="name">{{ estate.ownerInfo?.name }}</span>
          <span class="sub">임대인</span>
        </span>
        <a :href="`tel:${estate.ownerInfo.virtualNumber}`" class="tel">
          {{ estate.ownerInfo.virtualNumber }}
        </a>
      </div>
      <ul class="direction-contract">
        <li>직거래 계약에 회사는 법률적 책임을 부담하지 않습니다.</li>
        <li>자세한 내용은 이용약관 제12조(직거래 계약)을 확인해주세요.</li>
      </ul>
    </div>
  </modal>
  <div v-if="estate" class="estate-detail">
    <div class="main">
      <image-filter
        v-if="!isMobile"
        class="main-image"
        :active="estate.traded"
        message="거래완료"
      >
        <img :src="mainImage" alt />
      </image-filter>
      <slider
        v-if="isMobile"
        :contents="estate.roomImages"
        class="image-slider"
      />
      <div class="info-box">
        <div class="stamp-box">
          <span class="stamp type">{{ estate.houseInfo.type }}</span>
          <span class="stamp brokerage"> 중개 </span>
          <span v-if="estate.directTransaction" class="stamp direct">
            직거래
          </span>
        </div>
        <div class="house-price">
          <div class="name-building">
            <div v-if="estate.locationInfo.buildingName">
              {{ estate.locationInfo.buildingName }}
            </div>
            <div>{{ estate.locationInfo.building }}동</div>
          </div>
          <h2>
            {{ estate.transactionInfo.type }}
            {{ amount(estate.transactionInfo) }}
          </h2>
        </div>
        <div class="info">
          {{ estate.houseInfo.relevantFloor }}층 /
          {{ estate.houseInfo.area.dedicated }}m<sup>2</sup><br />
          {{ estate.locationInfo.addressName }}
        </div>
        <div class="tool-box">
          <div class="visitable">
            <span>방문 가능 여부 :</span>
            <span :class="estate.visitable ? '가능' : '불가능'">
              {{ estate.visitable ? '가능' : '불가능' }}
            </span>
          </div>
          <div class="tools">
            <span class="wish-views">
              <button
                class="wish-list"
                @click="wishTheEstate"
                :disabled="isMine"
              >
                <span class="icon" :class="{ fill: estate.isWished }">
                  <font-awesome-icon :icon="[fill, 'heart']" />
                </span>
                <span class="count">
                  {{ estate.wishListCount }}
                </span>
              </button>
              ∣
              <span class="views">
                <span class="label">조회수</span>
                <span class="count">{{ estate.views }}</span>
              </span>
            </span>
            <button class="report" @click="openReport">
              <span class="icon">
                <font-awesome-icon :icon="['fal', 'siren-on']" />
              </span>
              <span class="label">신고</span>
            </button>
          </div>
        </div>
        <div class="seller" v-if="!(isMine || estate.traded)">
          <span class="seller-info">
            <span class="sub">임대인</span>
          </span>
          <button @click="modalTel = true">
            <font-awesome-icon :icon="['fas', 'mobile-alt']" />
            <span>연락처</span>
          </button>
        </div>
        <div v-if="estate.traded" class="traded">거래 완료</div>
        <router-link
          v-else
          :to="{ name: 'Brokerage', query: { realEstateId: estate._id } }"
        >
          중개 요청하기
        </router-link>
      </div>
      <div
        v-if="!isMobile && estate.roomImages.length !== 1"
        class="shown-images"
      >
        <img
          v-for="image in shownImages"
          :key="image"
          :src="image"
          alt="세부 이미지"
          @mouseover="mainImage = image"
        />
        <span
          v-if="estate.roomImages.length > 4"
          class="more-images"
          :class="{ 'more-images-after': estate.roomImages.length > 5 }"
          :style="{ backgroundImage: `url(${estate.roomImages[4]})` }"
          @mouseover="mainImage = estate.roomImages[4]"
          @click="
            estate.roomImages.length > 5
              ? (modalImage = true)
              : (modalImages = false)
          "
        />
      </div>
    </div>
    <div
      class="fees-calc"
      v-if="feesData.isDiscount && parseInt(feesData.fees) > 0"
    >
      <h2>
        에이파트를 통해 <br /><span class="active"
          >중개수수료<span>{{ setPriceUnit(parseInt(feesData.fees)) }}</span>
          절약!!</span
        >
      </h2>
    </div>
    <div class="details">
      <sector title="방 정보">
        <div class="grid">
          <div
            class="info-item"
            v-if="
              estate.houseInfo.area.supply && estate.houseInfo.area.dedicated
            "
          >
            <div class="label">공급 면적 / 전용 면적</div>
            <div class="content">
              <span>{{ estate.houseInfo.area.supply }}㎡</span> /
              <span>{{ estate.houseInfo.area.dedicated }}㎡</span>
            </div>
          </div>
          <div class="info-item" v-else>
            <div class="label">평 수</div>
            <div class="content">
              <span>{{ estate.houseInfo.area.pyeong }} 평</span>
            </div>
          </div>

          <div class="info-item">
            <div class="label">해당 층 / 건물 층</div>
            <div class="content">
              {{ estate.houseInfo.buildingFloor }}층 /
              {{ estate.houseInfo.relevantFloor }}층
            </div>
          </div>
          <div class="info-item">
            <div class="label">방 개수 / 욕실 개수</div>
            <div class="content">
              {{ estate.houseInfo.roomCount }}개 /
              {{ estate.houseInfo.bathroomCount }}개
            </div>
          </div>
          <div class="info-item" v-if="estate.houseInfo.structure">
            <div class="label">구조</div>
            <div class="content">{{ estate.houseInfo.structure }}</div>
          </div>
          <div class="info-item half">
            <div class="label">
              관리비
              <tool-tip
                class="management-items"
                theme="dark"
                messages="매도인(임대인)이 직접 입력한 월 평균 관리비로<br>실 사용량, 건물 사정 등에 따라 변동 될 수 있습니다."
              >
                <font-awesome-icon :icon="['fas', 'question-circle']" />
              </tool-tip>
            </div>
            <div class="content">
              {{ estate.transactionInfo.managementFees }}만원
            </div>
          </div>
          <div class="info-item">
            <div class="label">입주가능일</div>
            <div class="content">
              {{
                estate.transactionInfo.moveInType === '날짜 선택'
                  ? moment(estate.transactionInfo.moveInDate).format(
                      'YYYY.MM.DD'
                    )
                  : estate.transactionInfo.moveInType
              }}
            </div>
          </div>
        </div>
      </sector>
      <sector title="추가 정보">
        <div class="grid">
          <div class="info-item">
            <div class="label">주차</div>
            <div class="content">
              {{ estate.moreInfo.parking ? '가능' : '불가능' }}
            </div>
          </div>
          <div class="info-item">
            <div class="label">엘리베이터</div>
            <div class="content">
              {{ estate.moreInfo.elevator ? '있음' : '없음' }}
            </div>
          </div>
          <div class="info-item options">
            <div class="label">옵션</div>
            <div class="content">
              <span v-for="option in estate.moreInfo.option" :key="option">
                {{ option }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <div class="label">반려동물</div>
            <div class="content">
              {{ estate.moreInfo.pet ? '가능' : '불가능' }}
            </div>
          </div>
          <div class="info-item">
            <div class="label">빌트인</div>
            <div class="content">
              {{ estate.moreInfo.builtIn ? '있음' : '없음' }}
            </div>
          </div>
        </div>
      </sector>
      <sector title="상세 설명">
        <p class="description">
          {{ estate.detailDescription.description }}
        </p>
      </sector>
      <sector
        title="상세 위치"
        :sub-title="estate.locationInfo.addressName"
        :column="true"
      >
        <div id="map" ref="map" />
      </sector>
      <sector v-if="estate.detailDescription.privateMemo" title="비공개 메모">
        <div class="private-memo">
          {{ estate.detailDescription.privateMemo }}
        </div>
      </sector>
    </div>
    <div
      class="apart-guide-btn"
      ref="guide"
      @click="$router.push({ name: 'ApartGuide' })"
    >
      에이파트<br />설명서
    </div>
  </div>
</template>

<script>
// TODO seller info
import Sector from '@/components/template/Sector'
import ToolTip from '@/components/tool/ToolTip'
import { Map } from '@/modules/map'
import Modal from '@/components/tool/Modal'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import { amount } from '@/modules/tools'
import BaseInput from '@/components/form/base/BaseInput'
import BaseTextarea from '@/components/form/base/BaseTextarea'
import BaseButton from '@/components/form/base/BaseButton'
import BaseSelect from '@/components/form/base/BaseSelect'
import { v4 as uuidV4 } from 'uuid'
import Spinner from '@/components/tool/Spinner'
import { attachedImageRegex } from '@/assets/data/regex'
import upload from '@/service/upload'
import { mapGetters } from 'vuex'
import Slider from '@/components/tool/Slider'
import moment from 'moment'
import ImageFilter from '@/components/tool/ImageFilter'
import { feesCalculator } from '@/modules/feesCalculator'
import { setPriceUnit } from '@/modules/tools'

export default {
  components: {
    ImageFilter,
    Slider,
    Spinner,
    BaseSelect,
    BaseButton,
    BaseTextarea,
    BaseInput,
    Modal,
    ToolTip,
    Sector,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    isMine: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['loggedIn', 'isMobile']),
    errorMessages() {
      const messages = []

      if (
        !['허위매물 신고', '버그 신고', '개선사항', '기타'].includes(
          this.report.form.category
        )
      ) {
        messages.push('문의 유형을 선택해주세요.')
      }

      if (
        !(this.report.form.title
          ? this.report.form.title.length >= 2 &&
            this.report.form.title.length <= 50
          : false)
      ) {
        messages.push('제목을 작성해주세요.')
      }

      if (
        !(this.report.form.description
          ? this.report.form.description.length <= 500
          : false)
      ) {
        messages.push('내용을 작성해주세요.')
      }

      const urlRegex = attachedImageRegex
      if (!(this.report.form.attachedImages.length <= 5)) {
        messages.push('사진을 최대 5장 이하로 등록해주세요.')
      } else if (
        !this.report.form.attachedImages.every((url) => urlRegex.test(url))
      ) {
        messages.push('사진을 업로드 중 입니다.')
      }

      return messages
    },
    fill() {
      return this.estate.isWished ? 'fas' : 'fal'
    },
    shownImages() {
      return this.estate.roomImages.slice(0, 4)
    },
    focusImages() {
      let array = []

      if (this.focusIndex < 5) {
        array = this.estate.roomImages.slice(0, 5)
      } else {
        array = this.estate.roomImages.slice(5)
      }
      return array
    },
  },
  data() {
    return {
      feesData: null,
      modalReport: false,
      modalImage: false,
      modalTel: false,
      focusIndex: 0,
      mainImage: '',
      estate: null,
      map: null,
      report: {
        form: {
          category: '',
          title: '',
          description: '',
          attachedImages: [],
          realEstateId: this.id,
        },
        fileNames: [],
        regex: attachedImageRegex,
        options: [
          {
            value: '허위매물 신고',
            label: '허위매물 신고',
          },
          {
            value: '버그 신고',
            label: '버그 신고',
          },
          {
            value: '개선사항',
            label: '개선사항',
          },
          {
            value: '기타',
            label: '기타',
          },
        ],
      },
    }
  },
  created() {
    this.fetchEstate()
  },
  updated() {
    this.initMap(
      this.estate.locationInfo.coordinate.latitude,
      this.estate.locationInfo.coordinate.longitude
    )
  },
  mounted() {
    this.guideBtnEvent()
  },
  methods: {
    moment,
    feesCalculator,
    setPriceUnit,
    guideBtnEvent() {
      setTimeout(() => {
        if (this.$refs.guide) {
          this.$refs.guide.style.transform = 'scale(1)'
        }else{
          this.guideBtnEvent()
        }
      }, 1500)
    },
    openReport() {
      if (this.loggedIn) {
        this.modalReport = true
      } else {
        this.$store.commit('OPEN_SIGN_IN_MODAL')
      }
    },
    postInquiry() {
      if (!this.errorMessages.length) {
        this.$store
          .dispatch('postInquiry', this.report.form)
          .then((id) => {
            this.$store.dispatch('insertNotification', {
              content: '신고 되었습니다.<br>빠른 시일내에<br>답변드리겠습니다.',
            })
            this.$router.push({ name: 'MyInquiryDetail', params: { id } })
          })
          .catch((error) => {
            const status = error.response.status
            if (status === 429) {
              this.$store.dispatch('insertNotification', {
                type: 'error',
                content:
                  '동일한 매물에 대한 신고는<br>24시간에 1회로 제한됩니다.',
              })
            } else {
              errorHandler(error)
            }
          })
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 접근입니다.',
        })
      }
    },
    insertFile(event) {
      const file = event.target.files[0]
      const caution = this.$refs.caution

      if (!(file && this.validFileType && file.size <= 5242880)) {
        caution.classList.add('error')
      } else {
        const id = uuidV4()
        this.report.form.attachedImages.push(id)
        this.report.fileNames.push(file.name)

        upload
          .postAttachedImage(file)
          .then((response) => {
            const index = this.report.form.attachedImages.indexOf(id)
            this.report.form.attachedImages.splice(index, 1, response.data)
            caution.classList.remove('error')
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.FILE))
      }
    },
    validFileType(file) {
      const fileTypes = ['image/jpeg', 'image/png']
      return fileTypes.includes(file.type)
    },
    removeImage(index) {
      this.report.fileNames.splice(index, 1)
      this.report.form.attachedImages.splice(index, 1)
    },
    async fetchEstate() {
      if (this.isMine) {
        this.estate = await this.$store
          .dispatch('fetchMyEstate', this.id)
          .catch((error) => errorHandler(error, ERROR_TYPE.PAGINATION))
      } else {
        this.estate = await this.$store
          .dispatch('fetchEstate', this.id)
          .catch((error) => errorHandler(error, ERROR_TYPE.PAGINATION))
      }
      this.mainImage = this.estate.roomImages[0]
      this.feesData = feesCalculator(
        this.estate.houseInfo.type,
        this.estate.transactionInfo
      )
    },
    amount,
    initMap(latitude, longitude) {
      this.map = new Map(this.$refs.map, { latitude, longitude, level: 3 })
      this.map.createMarker(this.map.loadCoordinate(latitude, longitude))
    },
    wishTheEstate() {
      if (this.estate.isWished) {
        this.$store
          .dispatch('unWishTheEstate', this.id)
          .then(() => {
            this.$store.dispatch('insertNotification', {
              content: '내 찜 목록에서 제거하였습니다.',
            })
            this.estate.isWished = false
            this.estate.wishListCount--
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.WISHLIST))
      } else {
        this.$store
          .dispatch('wishTheEstate', this.id)
          .then(() => {
            this.$store.dispatch('insertNotification', {
              content: '내 찜 목록에 추가하였습니다.',
            })
            this.estate.isWished = true
            this.estate.wishListCount++
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.WISHLIST))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');

.active {
  font-size: 1.2em;
}
.focus-image {
  outline: 5px solid $color-primary !important;
}
.mobile-header {
  width: 100%;
  z-index: 2;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid $border-disable;
  padding: 0.625em;
  background-color: $background-default;

  button {
    position: absolute;
    left: 1em;
    cursor: pointer;
    background-color: transparent;
    border: none;
    font: {
      family: 'Noto Sans KR', sans-serif;
      size: 1.25em;
    }
  }

  h3 {
    font: {
      weight: 400;
      size: 1em;
    }
  }
}

.mobile-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 0.5em;
  text-align: center;
  text-decoration: none;
  color: $color-contrast;
  z-index: 2;
  background-color: $background-primary;
  font: {
    size: 1.375em;
  }
}

.modal {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .modal-image {
    padding: 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;

    .focus-box {
      display: flex;
      gap: 2em;
      justify-content: center;
      .main-image {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 800px;
        height: 400px;

        img {
          // min-width: calc(500px + 4em);
          width: auto;
          height: 100%;
        }
      }

      .arrow {
        display: flex;
        align-items: center;
        font-size: 3em;
        color: $color-disable;
        cursor: pointer;
      }
    }

    .list {
      display: flex;
      justify-content: center;
      gap: 1em;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
      }
    }
  }

  .modal-report {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .input-box {
      display: flex;
      flex-direction: column;
      gap: 1.5em;

      .textarea {
        height: 200px;
      }

      .file-input {
        display: flex;
        gap: 1em;

        .label {
          flex-shrink: 0;
          width: 5em;
          font: {
            size: 1.125em;
            weight: 500;
          }
        }

        .file-box {
          flex-grow: 1;
          padding: 0.5em;
          border: 1px solid $border-disable;
          display: flex;
          flex-direction: column;
          gap: 0.5em;

          > div {
            padding: 0.2em;
            display: flex;
            align-items: center;
            gap: 1em;
            background-color: $background-foundation;

            > span {
              &:nth-of-type(1) {
                color: $color-primary;
              }

              &:nth-of-type(2) {
                flex-grow: 1;
                text-overflow: ellipsis;
              }

              &:nth-of-type(3) {
                color: $color-error;
                cursor: pointer;
              }
            }
          }
        }

        input {
          opacity: 0;
          position: absolute;
        }
      }
    }

    ul {
      border-top: 1px solid $border-disable;
      list-style-position: inside;

      > li {
        margin: 0.5em 0.1em;

        &::marker {
          font-size: 0.5em;
        }

        &.error {
          transition: 0.5s;
          color: $color-error;
        }
      }
    }

    button {
      padding: 0.8em 4em;
      border-radius: 0;
      font: {
        size: 1em;
        weight: 400;
      }
    }
  }

  .modal-tel {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1em;

      .seller-info {
        display: flex;
        align-items: flex-end;
        gap: 0.5em;

        .name {
          font: {
            size: 1.5em;
            weight: 500;
          }
        }

        .sub {
          color: $color-disable;
          font: {
            size: 1.125em;
            weight: 500;
          }
        }
      }

      .tel {
        text-decoration: none;
        color: $color-default;
        font: {
          size: 1.125em;
          weight: 500;
        }
      }
    }

    ul {
      list-style-position: inside;

      li {
        color: $color-error;
      }
    }
  }
}

.estate-detail {
  padding: 5em 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5em;
  .apart-guide-btn {
    border-radius: 70%;
    background: $color-primary;
    width: 150px;
    height: 150px;
    text-align: center;
    padding-top: 40px;
    text-align: center;
    position: fixed;
    right: 50px;
    bottom: 50px;
    color: #fff;
    font-size: 2em;
    font-family: 'Black Han Sans', sans-serif;
    text-shadow: 3px 8px 8px rgb(0 0 0 / 45%);
    box-shadow: 2px 3px 8px 1px #888;
    cursor: pointer;
    transition: 0.5s;
    transform: scale(0);
    z-index: 1;
  }
  .fees-calc {
    width: 100%;
    max-width: 1080px;
    height: 15vh;
    text-align: center;
    background-color: #fafafa;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    font-size: 1.5em;
    span {
      span {
        color: $color-primary;
      }
    }
  }
  .main {
    display: grid;
    grid-template-columns: 800px 350px;
    gap: 25px 95px;

    .main-image {
      aspect-ratio: 2 / 1;
      grid-column: 1 / 2;
      grid-row: 1 / 2;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        mix-blend-mode: soft-light;
      }
    }

    .image-slider {
      width: 100%;
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }

    .info-box {
      width: 350px;
      padding-bottom: 5em;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: stretch;
      grid-column: 2 / 3;
      grid-row: 1 / 3;
      gap: 1em;
      .house-price {
        .name-building {
          display: flex;
          div {
            font-weight: 500;
            font-size: 18px;
            margin-right: 4%;
          }
          margin-bottom: 0.5em;
        }
      }
      .stamp-box {
        display: flex;
        gap: 1em;

        .stamp {
          padding: 0.25em;
          width: 5em;
          text-align: center;
          color: $color-contrast;
          font: {
            size: 0.75em;
            weight: 400;
          }

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
      }

      .id {
        color: $color-disable;
        font-weight: 400;
      }

      .info {
        padding-bottom: 1em;
        border-bottom: 1px solid $border-disable;
        font: {
          size: 0.875em;
          weight: 400;
        }
      }

      .tool-box {
        padding-bottom: 1em;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid $border-disable;
        gap: 1em;

        > div {
          &.visitable {
            display: flex;
            gap: 0.5em;

            span {
              font-weight: 500;

              &.가능 {
                color: $color-point-green;
              }

              &.불가능 {
                color: $color-point-pink;
              }
            }
          }

          &.tools {
            display: flex;
            justify-content: space-between;

            .wish-views {
              display: flex;
              align-items: center;
              gap: 0.5em;

              .wish-list {
                display: flex;
                gap: 0.5em;
                align-items: center;
                background-color: transparent;
                border: none;
                cursor: pointer;
                font: {
                  family: 'Noto Sans KR', sans-serif;
                  size: 1em;
                }

                .icon {
                  font-size: 1.125em;

                  &.fill {
                    color: $color-heart;
                  }
                }

                .count {
                  font: {
                    weight: 500;
                    size: 1.125em;
                  }
                }
              }

              .views {
                display: flex;
                align-items: center;
                gap: 0.5em;

                .count {
                  font: {
                    weight: 500;
                    size: 1.125em;
                  }
                }
              }
            }

            .report {
              display: flex;
              align-items: center;
              gap: 0.5em;
              border: none;
              background-color: transparent;
              cursor: pointer;
              font: {
                size: 1em;
                weight: 300;
                family: 'Noto Sans KR', sans-serif;
              }

              .icon {
                color: $color-error;
                font-size: 1.125em;
              }
            }
          }
        }
      }

      .seller {
        padding-bottom: 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $border-disable;

        .seller-info {
          display: flex;
          align-items: flex-end;
          gap: 0.5em;

          .name {
            font: {
              size: 1.5em;
              weight: 500;
            }
          }

          .sub {
            color: $color-disable;
            font: {
              size: 1.125em;
              weight: 500;
            }
          }
        }

        button {
          cursor: pointer;
          display: flex;
          gap: 0.5em;
          align-items: center;
          background-color: $background-default;
          border: 1px solid $border-primary;
          border-radius: 2em;
          padding: 0.3em 1em;
          font: {
            family: 'Noto Sans KR', sans-serif;
            size: 1em;
            weight: 500;
          }

          svg {
            font-size: 0.75em;
          }

          span {
            font-size: 0.75em;
          }
        }
      }

      a {
        text-decoration: none;
        color: $color-contrast;
        background-color: $background-primary;
        padding: 0.875em;
        border-radius: 0.5em;
        text-align: center;
        font: {
          family: 'Noto Sans KR', sans-serif;
          size: 1.125em;
          weight: 500;
        }
      }

      .traded {
        cursor: not-allowed;
        text-decoration: none;
        color: $color-contrast;
        background-color: $background-error;
        padding: 0.875em;
        border-radius: 0.5em;
        text-align: center;
        font: {
          family: 'Noto Sans KR', sans-serif;
          size: 1.125em;
          weight: 500;
        }
      }
    }

    .shown-images {
      display: flex;
      gap: 1.5em;
      justify-content: center;

      img {
        width: 110px;
        height: 110px;
        object-fit: cover;
        object-position: center;
      }
      .more-images-after,
      .more-images {
        width: 110px;
        height: 110px;
        background: {
          repeat: no-repeat;
          position: center;
          size: cover;
        }
      }
      .more-images-after:after {
        content: '더보기 ≻';
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $color-contrast;
        background-color: $background-filter;
        font: {
          family: 'Noto Sans KR', sans-serif;
          weight: 400;
          size: 0.875em;
        }

        cursor: pointer;
      }
    }
  }

  .details {
    width: 1080px;
    display: flex;
    flex-direction: column;
    gap: 5em;

    .grid {
      display: grid;
      grid-template-columns: 50% 50%;

      .info-item {
        padding: 2em 1.5em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $border-disable;

        .label {
          display: flex;
          gap: 1em;
          color: $color-disable;
          font: {
            size: 1.125em;
            weight: 500;
          }

          .management-items {
            color: $color-primary;
          }
        }

        .content {
          max-width: 50%;
          display: flex;
          flex-wrap: wrap;
          gap: 0 0.5em;
          justify-content: flex-end;
          font: {
            size: 1.125em;
            weight: 500;
          }
        }

        &.options {
          .content {
            max-width: 75%;
          }
        }
      }
    }

    .description {
      padding: 1em;
      white-space: pre-wrap;
      word-break: normal;
    }

    #map {
      margin: 1em 0;
      width: 100%;
      aspect-ratio: 5 / 3;
    }

    .private-memo {
      margin: 1em 0;
      padding: 1.5em 1em;
      border: 1px solid $border-disable;
      word-break: normal;
    }
  }
}

@media (max-width: 1024px) {
  .modal {
    .modal-report {
      .input-box {
        .file-input {
          .label {
            width: 4em;
          }
        }
      }
    }

    .modal-tel {
      font-size: 0.8em;
    }
  }
  .estate-detail {
    font-size: 0.875em;
    padding: 0;
    gap: 1em;
    .apart-guide-btn{
      display: none;
    }
    .main {
      display: flex;
      flex-direction: column;
      gap: 0;

      .info-box {
        padding: 1em;
        width: auto;

        .tool-box {
          padding: 1em 0;
        }

        .seller {
          padding: 1em 0;
        }
      }
    }

    .details {
      width: auto;
      padding: 1em;
      gap: 1em;

      .sector {
        .content {
          .grid {
            display: flex;
            flex-direction: column;

            .info-item {
              padding: 1em 0;

              &.options {
                .content {
                  max-width: 75%;
                }
              }
            }
          }
        }
      }

      .description {
        padding: 1em 0;
      }

      .private-memo {
        padding: 1em 0;
      }
    }
  }
}
</style>
