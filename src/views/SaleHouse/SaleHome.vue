<template>
  <div class="box-salehouse" @scroll.prevent :key="$store.sign" ref="container">
    <div class="list-salehouse">
      <sale-house-list
        :houseInfos="houseInfos"
        :requestable="requestable"
        :isMobile="isMobile"
        :mapHeight="mapHeight"
        :totalHouseCount="totalHouseCount"
        v-model:isVisibleFilterList="isVisibleFilterList"
        v-model:filterData="filterData"
        v-model:zoomChange="zoomChange"
        @update:sort="sort = $event"
        @update:filterData="requirementFiltering"
        @coordinate="indicatePickMarker"
        @signIn="openAndCloseSignInModal('open')"
        @reset="$store.commit('RESET_FILTER')"
      />
    </div>
    <transition name="fade">
      <sign-in @close:sign-in="openAndCloseSignInModal('close')" v-if="false" />
    </transition>
    <div id="map" ref="map"></div>
    <div class="box-search" v-if="isMobile">
      <div class="search" ref="searchContent">
        <font-awesome-icon class="search-icon" :icon="['fas', 'search']" />
        <autocomplete @searchFocus="isVisibleFilterList = 'close'" />
        <font-awesome-icon
          class="search-icon_02"
          :icon="['fal', 'sliders-h']"
          @click="isVisibleFilterList = !isVisibleFilterList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { markRaw } from 'vue'
import SaleHouseService from '@/service/salehouse.js'
import SaleHouseList from '@/components/SaleHouse/SaleHouseList'
import SignIn from '@/components/sign/SignIn'
import { mapGetters } from 'vuex'
import Autocomplete from '@/components/tool/Autocomplete'
import kakaoSearchConfig from '@/assets/data/kakaoSearch'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
export default {
  name: 'SaleHouse',
  computed: {
    ...mapGetters(['loggedIn', 'isMobile']),
  },
  components: { SaleHouseList, SignIn, Autocomplete },
  data() {
    return {
      map: null,
      circle: null,
      clusterer: null,
      requestTimer: null,
      houseCoordinates: null,
      placeSearchService: null,
      resetEventReloadTimer: null,
      markers: [],
      houseInfos: [],
      mapHeight: 0,
      totalHouseCount: 0,
      isVisibleFilterList: true,
      zoomChange: false,
      requestable: true,
      coodinateable: true,
      keyword: this.$route.query.keyword,
      filterData: Object.assign(this.$store.state.sale.filterData),
      sort: 'recommended',
      startMapLevel: 8,
      circleMarker: null,
      selectedMarker: null,
      pageInfo: {
        currentPage: 1,
        limit: 15,
        pageSize: 1,
      },
    }
  },
  mounted() {
    // 가장먼저 시작되는 함수.

    // 모바일뷰를 위해 먼저 전체적인 크기를 전달하기 위해 저장한다.
    this.mapHeight = this.$refs.map.clientHeight

    // 시작 세팅을 위해 함수를 호출한다.
    this.settingMap()
    let header = window.document.querySelector('.header')
    // header의 clientHeight값은 75라고 표현되지만 border 1px이 존재하므로 +1을 더해 100vh로 맞춰준다.
    this.$refs.container.style.height = `calc(${window.innerHeight}px - ${
      header.clientHeight + 1
    }px )`
  },
  beforeUnmount() {
    // 페이지를 새로고침하거나 페이지가 리렌더 될때 실행되는 함수

    // vuex에 저장된 새로고침 하기 전 필터데이터를 불러온다.
    this.$store.commit('SET_FILTER', this.filterData)

    // document에 등록되어있는 지도를 삭제. 삭제를 안하면 지도가 겹쳐보이는 에러가 발생한다.
    let map = window.document.querySelector('#map')
    for (let i = 0; i < map.childElementCount; i++) {
      map.children[i].remove()
    }
  },
  methods: {
    openAndCloseSignInModal(state) {
      // 로그인이 필요한 작업을 할때 로그인 창을 열어주는 함수
      if (state === 'open') {
        this.$store.commit('OPEN_SIGN_IN_MODAL')
      } else if (state === 'close') {
        this.$store.commit('CLOSE_SIGN_IN_MODAL')
      } else {
        console.log(new Error('Wrong parameter'))
      }
    },
    settingMap() {
      // 카카오 맵을 여러함수에서 사용해야 하기 때문에 this.map에 kakao.maps 를 연결한다.

      /* global kakao */
      // center은 지도의 최초 좌표를 어디를 중심으로 할것인가.
      // level은 지도의 레벨은 지도의 확대 단계를 말한다. 레벨이 낮을수록 지도가 확대된다.
      this.map = markRaw(
        new kakao.maps.Map(document.getElementById('map'), {
          center: new kakao.maps.LatLng(37.51052097039312, 126.98171969657317),
          level: this.startMapLevel,
        })
      )
      this.map.setMaxLevel(11)
      //37.505289107697074, 127.10641465543625 company coordinate

      // 지도 검색을 위한 카카오에서 제공하는 서비스를 전역으로 미리 선언해둔다.
      this.placeSearchService = new kakao.maps.services.Places()
      this.circleMarker = new kakao.maps.CustomOverlay({
        map: this.map,
        position: new kakao.maps.LatLng(37.51052097039312, 126.98171969657317),
        content: '<div class="circle-marker"></div>',
        zIndex: -1,
      })
      // this.circleMarker.setZIndex(10)
      // this.circleMarker.setMap(this.map)

      // 지도를 셋팅할 때 검색어를 통해 들어온건지. 그냥 들어온건지 판별하여 분기한다.
      if (this.keyword) {
        // 키워드가 있다면 검색을 통해 들어온 것이니 추가셋팅을 위해 searchKeyword 함수를 호출
        this.searchKeyword()
      } else {
        // 없다면 그냥 들어온것이니 초기값 셋팅을 위해 getSaleHouse 함수와 addEvent 호출
        this.getSaleHouse()
        this.addEvent()
      }
    },
    requirementFiltering(requirementObject) {
      // 검색 조건 객체를 필터링 해주는 함수.
      if (!this.requestTimer) {
        // 너무 많은 요청이 들어오면 에러가 생겨 setTimeout으로 요청을 조절
        this.requestTimer = setTimeout(() => {
          this.requestTimer = null

          // 검색조건에 맞춰 클러스터를 새로 만들어야 하기때문에 기존의 만들어진 클러스터 전부 제거
          if (this.clusterer) {
            this.clusterer.clear()
          }
          // 목록이 최상단으로 올라가기 때문에 리스트 인덱스를 0으로 초기화.

          // 검색조건을 적용하여 함수로 이동시키며 함수에 필터에서 보냈다고 표시
          this.filterData = requirementObject

          // filterData의 필요없는 부분들은 제거하여 엑시오스 요청에 혼란을 주지 않는다.
          for (let i in this.filterData) {
            if (this.filterData[i]?.length < 1) {
              delete this.filterData[i]
            }
          }

          this.getSaleHouse('filter')
        }, 100)
      }
    },
    getSaleHouse(type) {
      // 내가 보고있는 지도 내부에 매물이 있다면 표시해주기 위한 가장 중요한 함수

      // 서버에서 데이터를 받아 표시해주기까지의 시간들을 표시해주기위한 로딩 시작
      this.$store.commit('START_LOADING')

      // 내가 지금 보고있는 지도의 좌표를 가져오기 위해 초기값 셋팅
      let bounds = this.map.getBounds()

      // api의 양식에 맞추기위해 문자열로 변환
      this.filterData.point = [bounds.qa, bounds.ha, bounds.pa, bounds.oa].join(
        ','
      )
      if(type === 'filter'){
        this.pageInfo.currentPage = 1
      }
      // 현재 맵의 레벨과 클러스터의 레벨을 불러온다.
      let currentMapLevel = this.map.getLevel()
      let clusterLevel = this.getClusterLevel(currentMapLevel)

      // 서버에서 데이터를 받아올때 이미 받아서 처리하는 중이라면 함수를 실행시키지않는다.
      if (this.coodinateable) {
        this.coodinateable = false

        SaleHouseService.getDefaultHouse({
          ...this.filterData,
          clusterLevel: clusterLevel,
        })
          .then((res) => {
            // 받아온 좌표 저장
            this.houseCoordinates = res.data

            // 받아온 좌표의 갯수 저장
            this.totalHouseCount = res.data.reduce((prev, next) => {
              return (prev += next.count)
            }, 0)

            // 좌표에 마커를 찍기위해 함수 실행
            this.indicateMarkers()

            if (res.data.length > 0) {
              // 받아온 좌표의 갯수가 1개 이상이라면 좌표의 매물정보를 알아오기 위해 시작
              this.getSalehouseInfos(type)
            } else {
              // 받아온 좌표가 없다면 클러스터러를 초기화 하고
              if (this.clusterer) {
                this.clusterer.clear()
              }
              // 리스트에 등록된 매물이 없다고 표현해주기위해 false
              this.houseInfos.has = false

              // 엑시오스를 다시 요청할 수 있도록 flag를 돌려놓고 로딩 종료
              this.coodinateable = true
            }
          })
          .catch((err) => {
            errorHandler(err)
            this.houseInfos = []
            this.houseInfos.has = false
            this.totalHouseCount = 0
          })
          .finally(() => {
            this.$store.commit('END_LOADING')
            this.coodinateable = true
          })
      }
    },
    addEvent() {
      // 맵에 필요한 event 등록

      // 초기화가 필요한 변수를 초기화 해주는 함수
      let resetReloadHandler = async () => {
        clearTimeout(this.resetEventReloadTimer)

        this.resetEventReloadTimer = setTimeout(() => {
          this.houseInfos = []
          // this.markers = null
          this.requestable = true
          this.houseCoordinates = []
          this.zoomChange = true
          this.pageInfo.currentPage = 1
          // 클러스터러가 있다면 클러스터러도 초기화한다.
          if (this.clusterer) {
            this.clusterer.clear()
          }
          this.getSaleHouse()
        }, 300)
      }

      // 이벤트 등록
      kakao.maps.event.addListener(this.map, 'dragend', resetReloadHandler)
      kakao.maps.event.addListener(this.map, 'zoom_changed', resetReloadHandler)
    },
    indicateMarkers() {
      // 화면에 마커를 표시해주는 함수
      if (this.markers) {
        this.markers.forEach((marker) => marker.setMap(null))
        this.markers = null
      }
      let houseCoordinates = this.houseCoordinates
      let markers = []
      let currentMapLevel = this.map.getLevel()

      // 서버에서 받아온 좌표들의 길이만큼 포문을 돌려 커스텀한 마커를 화면에 표시한다.
      for (let i = 0; i < houseCoordinates.length; i++) {
        let x = houseCoordinates[i].coordinate.latitude
        let y = houseCoordinates[i].coordinate.longitude

        // 커스텀 오버레이 함수는 클릭 이벤트를 돔트리에 넣어서 올려야 하기 때문에
        // 객체 형식으로 클릭 이벤트를 달아준다.
        let content = document.createElement('div')

        // 마커를 식별하기 위해 유니크한 좌표값을 id로 부여
        if (currentMapLevel <= 4) {
          content.id = `${y}${x}`
        }

        // 초기 css를 위해 클래스 네임도 추가
        content.className = 'marker-box'

        // 전에는 단일 마커였지만 내부에 돔트리가 추가되어 내부 구성
        let markerCount = document.createElement('div')
        markerCount.innerHTML = houseCoordinates[i].count
        markerCount.className = 'marker'
        content.appendChild(markerCount)

        // 커스텀 오버레이의 클릭 이벤트 구현
        content.onclick = () => {
          if (currentMapLevel < 5) {
            let bounds = { qa: x, ha: y, pa: x, oa: y }
            this.pageInfo.currentPage = 1
            // 필요한 좌표의 매물만 리스트에 띄우기 위해 특정좌표를 getSalehouseInfos에 전달
            this.getSalehouseInfos('filter', bounds)
          } else {
            // 좀더 레벨이 높을때는 마커를 눌렀을때 지도가 확대되며 중앙을 바꾸기 위해 함수 발동
            this.map.setCenter(new kakao.maps.LatLng(x, y))
            let level
            if (currentMapLevel > 8) {
              level = 8
            } else if (currentMapLevel > 6) {
              level = 6
            } else if (currentMapLevel > 4) {
              level = 4
            }
            this.map.setLevel(level)
          }
        }

        // 마커 내부 구현
        let title = document.createElement('div')
        let titleText

        if (currentMapLevel < 5) {
          content.style.padding = '0'
          content.style.border = '0'
          markerCount.style.border = '3px solid #5a95f5'
        } else if (currentMapLevel < 7) {
          content.style.border = '3px solid #5a95f5'
          titleText = document.createTextNode(houseCoordinates[i].eupMyeonDong)
        } else if (currentMapLevel < 9) {
          titleText = document.createTextNode(houseCoordinates[i].siGunGu)
        } else {
          titleText = document.createTextNode(houseCoordinates[i].sido)
        }

        if (titleText) {
          title.appendChild(titleText)
          title.className = 'marker-name'
          content.appendChild(title)
        }

        // 작성된 마커의 내부를 커스텀 오버레이에 장착하여 돔트리에 올린다.
        let marker = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(x, y),
          content: content,
        })
        markers.push(marker)
      }
      this.markers = markers

      // 마커 클러스터는 클러스터 레벨이 realEstate일때만  사용한다.
      if (currentMapLevel <= 4) {
        this.addClusterer(this.markers)
      } else {
        if (this.clusterer) {
          this.clusterer.clear()
        }
        this.markers.forEach((marker) => {
          marker.setMap(this.map)
        })
      }
    },
    addClusterer(markers) {
      if (this.clusterer) {
        this.clusterer.clear()
      }

      // 클러스터러를 만들기 위한 함수

      // 클러스터러를 만든다.
      // averageCenter는 마커들끼리의 평균 위치값을 기준으로 클러스터러를 생성한다.
      this.clusterer = markRaw(
        new kakao.maps.MarkerClusterer({
          map: this.map,
          averageCenter: true,
          minLevel: 1,
          gridSize: 80,
          styles: [
            {
              width: '40px',
              height: '40px',
              color: '#5a95f5',
              border: '3px solid #5a95f5',
              background: '#fff',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          ],
        })
      )

      // 마커에 마우스를 올렸을때 발동하는 이벤트로 클래스 네임을 추가하도록 만들어두고 css 커스텀은 style에서 할 수 있게 했다.
      kakao.maps.event.addListener(this.clusterer, 'clusterover', (cluster) => {
        cluster.getClusterMarker().a.firstChild.className += ' pick'
      })

      // 마커에 마우스를 뗐을때는 add에서 추가한 class를 빼준다.
      kakao.maps.event.addListener(
        this.clusterer,
        'clusterout',
        function (cluster) {
          cluster.getClusterMarker().a.firstChild.className = ''
        }
      )

      if (!this.requestTimer) {
        this.requestTimer = setTimeout(() => {
          this.requestTimer = null
          this.clusterer.addMarkers(markers)
        }, 100)
      }
    },
    getSalehouseInfos(type, currentBounds) {
      // currentBounds를 파라미터로 받았을때만 작동
      if (currentBounds) {
        this.filterData.point = [
          currentBounds.qa,
          currentBounds.ha,
          currentBounds.pa,
          currentBounds.oa,
        ].join(',')
      }

      // 만들어낸 배열을 서버에 요청데이터에 담아 보낸다.
      SaleHouseService.getSalehouseInfos({
        ...this.filterData,
        ...this.pageInfo,
        sort: this.sort,
      })
        .then(({ data }) => {
          // 필터를 사용해 받아온 정보들이라면 그대로 받아온다.
          if (type === 'filter') {
            this.houseInfos = data
          } else {
            // 그렇지 않을 경우엔 기존 데이터와 합쳐서 보관한다.
            this.houseInfos = [...this.houseInfos, ...data]
          }
          if (data.length < 15) {
            this.requestable = false
          }
          // 상태들을 초기화 시키거나 변화시켜준다.
          this.houseInfos.has = true
          this.zoomChange = false
          this.coodinateable = true
          this.pageInfo.currentPage += 1
        })
        .catch(errorHandler)
      // 매물리스트에 넣을 데이터를 다 받아왔기 때문에 로딩을 종료한다.
      this.$store.commit('END_LOADING')
    },
    getCircleRadius(currentMapLevel) {
      switch (currentMapLevel) {
        case 1:
          return 10
        case 2:
          return 20
        case 3:
          return 40
        case 4:
          return 60
        case 5:
          return 200
        case 6:
          return 250
        case 7:
          return 400
        case 8:
          return 900
        case 9:
          return 1200
        case 10:
        case 11:
          return 3000
      }
    },
    indicatePickMarker(locationInfo) {
      // 매물리스트에 있는 매물에 마우스를 오버시키면 발생하는 이벤트이다.
      let coordinate
      let circleMarker = window.document.querySelector('.circle-marker')

      if (locationInfo) {
        coordinate = locationInfo.split(',')
        this.selectedMarker = window.document.getElementById(
          `${coordinate[0]}${coordinate[1]}`
        )
        if (this.selectedMarker) {
          this.selectedMarker.style.display = 'none'
        }
        this.circleMarker.setPosition(
          new kakao.maps.LatLng(coordinate[1], coordinate[0])
        )
        if (circleMarker) {
          circleMarker.style.display = 'block'
        }
      } else {
        if (circleMarker) {
          circleMarker.style.display = 'none'
        }
        if (this.selectedMarker) {
          this.selectedMarker.style.display = 'block'
        }
      }
    },
    searchKeyword() {
      kakaoSearchConfig
        .kakaoSearchKeyword(this.keyword)
        .then(({ data }) => {
          if (data.documents.length === 0) {
            this.$store.dispatch('insertNotification', {
              type: 'error',
              content: '검색 결과가 없습니다.',
              time: 1,
            })
          } else {
            let bounds = new kakao.maps.LatLngBounds()
            bounds.extend(
              new kakao.maps.LatLng(data.documents[0].y, data.documents[0].x)
            )
            this.map.setBounds(bounds)
          }
        })
        .catch(() => {
          this.$store.dispatch('insertNotification', {
            type: 'error',
            content: '알 수 없는 오류가 발생하였습니다.',
            time: 1,
          })
        })
      setTimeout(() => {
        this.getSaleHouse()
        this.addEvent()
      }, 100)
    },
    getClusterLevel(level) {
      // 지도 레벨을 받아 api에 요청값으로 전환할 프로퍼티를 반환해주는 함수.
      switch (level) {
        case 1:
        case 2:
        case 3:
        case 4:
          return 'realEstate' // 매물리스트를 받을 레벨
        case 5:
        case 6:
          return 'eupMyeonDong' // 읍면동 레벨
        case 7:
        case 8:
          return 'siGunGu' // 시군구 레벨
        default:
          return 'siDo' // 시도 레벨
      }
    },
  },
}
</script>
<style lang="scss">
.circle-marker {
  width: 100px !important;
  height: 100px !important;
  border-radius: 70% !important;
  background: rgba(255, 119, 0, 0.7);
  position: relative;
  top: -50px;
  left: -50px;
  display: none;
}
.marker-box {
  background-color: $color-primary;
  display: flex;
  border-radius: 20px;
  border: 3px solid $color-primary;
  position: relative;
  left: 0px;
  top: 0px;

  .marker {
    width: 40px;
    height: 40px;
    color: $color-primary;
    border: 3px solid $color-primary;
    background: $color-contrast;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    transition: transform 0.3s;
  }
  .marker-name {
    background-color: $color-primary;
    color: $color-contrast;
    padding: 0.2em 0.7em 0 0.3em;
    font-weight: 400;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 1.2em;
    border-radius: 20px;
  }
}

.marker-box:hover {
  color: $color-primary;
  background: $color-contrast;
  border: 3px solid $color-primary;
  .marker {
    color: $color-contrast;
    background-color: $color-primary;
    border: 3px solid $color-contrast;
  }
  .marker-name {
    color: $color-primary;
    background-color: $color-contrast;
  }
}
.pick {
  color: $color-contrast !important;
  background: $color-primary !important;
  border: 0;
  .marker {
    color: $color-contrast !important;
    background-color: $color-primary !important;
    flex-grow: 1;
    border: 0;
  }
  .marker-name {
    color: $color-primary !important;
    background-color: $color-contrast !important;
  }
}
</style>
<style lang="scss" scoped>
.box-search {
  display: fixed;
  z-index: 1;
  width: 100%;
}
#map {
  z-index: 0;
  width: 100%;
}

.box-salehouse {
  display: flex;
  height: 94vh;
  .list-salehouse {
    width: 400px;
    min-width: 400px;
    height: 100%;
    overflow: hidden;
  }
}
@media (max-width: 1024px) {
  .box-salehouse {
    width: 100%;
    height: 86vh;
    flex-wrap: wrap-reverse;
    position: relative;
    overflow: hidden;
    #map {
      width: 100%;
      height: 100%;
    }
    .list-salehouse {
      background: $color-contrast;
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 0;
      overflow: hidden;
    }
    .box-search {
      background: #e5e5e5;
      height: 8%;
      min-height: 75px;
      position: absolute;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      z-index: 0;
      .search {
        height: 50%;
        width: 90%;
        background: $color-contrast;
        border-radius: 55px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        input {
          width: 75%;
          font-size: 0.8em;
          border-width: 0 1px 0 0;
        }
        .search-icon {
          font-size: 1.2em;
          margin-right: 2%;
        }
        .search-icon_02 {
          font-size: 1.2em;
          margin-left: 2%;
        }
        input:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
