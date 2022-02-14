<template>
  <base-fieldset legend="위치 정보" class="field-location_container">
    <input-address
      ref="address"
      v-model:roadAddress="roadAddress"
      v-model:address="address"
      @update:roadAddress="$emit('update:roadAddress', $event)"
      @update:address="$emit('update:address', $event)"
      @update:result="searchAddress"
      @update:errors=";(addressErrors = $event), errorController()"
      @buildingName="$emit('buildingName', $event)"
    />
    <input-detail-address
      ref="detailAddress"
      :building="building"
      :unit="unit"
      v-model:noneBuilding="noneBuilding"
      @update:noneBuilding="$emit('update:noneBuilding', $event)"
      @update:building="$emit('update:building', $event)"
      @update:unit="$emit('update:unit', $event)"
      @update:errors=";(detailAddressErrors = $event), errorController()"
    />
    <cover class="map-box" label="위치">
      <div id="map" ref="map"></div>
    </cover>
  </base-fieldset>
</template>

<script>
import BaseFieldset from '@/components/form/base/BaseFieldset'
import BaseInput from '@/components/form/base/BaseInput'
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import Cover from '@/components/form/Cover'
import { Map } from '@/modules/map'
import InputDetailAddress from '@/components/form/custom/InputDetailAddress.vue'
import InputAddress from '@/components/form/custom/InputAddress.vue'

export default {
  components: {
    Cover,
    BaseCheckbox,
    BaseInput,
    BaseFieldset,
    InputDetailAddress,
    InputAddress,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
    building: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: '',
    },
    noneBuilding: {
      type: Boolean,
      require: true,
    },
    roadAddress: {
      type: String,
      require: false,
    },
  },
  data() {
    return {
      map: null,
      errors: [],
      addressErrors: [],
      detailAddressErrors: [],
    }
  },
  methods: {
    errorController() {
      this.errors = [...this.addressErrors, ...this.detailAddressErrors]
      this.$emit('update:errors', this.errors)
    },
    async confirm() {
      await this.$refs.address.confirm()
      await this.$refs.detailAddress.confirm()

      this.errorController()
    },
    searchAddress(data) {
      this.map.addressSearch(data, (results, status) => {
        if (status === this.map.OK) {
          const result = results[0]

          const coords = this.map.loadCoordinate(result.y, result.x)
          this.map.createMarker(this.map.loadCoordinate(result.y, result.x))

          this.$emit('update:latitude', Number.parseFloat(result.y))
          this.$emit('update:longitude', Number.parseFloat(result.x))

          this.map.reLayout()

          this.map.setCenter(coords)

          this.map.setPosition(coords)
          this.$refs.address.confirm()
        }
      })
    },
    initMap() {
      const latitude = 37.566673940493025
      const longitude = 126.97848537974399

      this.map = new Map(this.$refs.map, {
        latitude,
        longitude,
        level: 4,
      })
      this.map.createGeocoder()
    },
    addScript() {
      const script = document.createElement('script')
      script.classList.add('location')
      script.setAttribute(
        'src',
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      )
      document.head.appendChild(script)
    },
    removeScript() {
      const removeItems = document.head.querySelectorAll('.location')
      removeItems.forEach((item) => {
        item.remove()
      })
    },
  },
  mounted() {
    this.addScript()
    this.initMap()
    this.$emit('update:modelValue', this.locationInfo)
  },
  unmounted() {
    this.removeScript()
  },
}
</script>

<style lang="scss" scoped>
.field-location_container {
  .address-detail {
    .wrapper {
      margin: 1em;
      display: flex;
      flex-direction: column;
      gap: 1em;

      .input-box {
        display: flex;
        gap: 2em;
      }
    }
  }

  .map-box {
    #map {
      margin: 2em;
      aspect-ratio: 5 / 3;
      border: 1px solid $border-disable;
      z-index: 1;
    }
  }
}

@media (max-width: 1024px) {
  .field-location_container {
    .address-detail {
      
    }

    .map-box {
      position: absolute;
      opacity: 0;
    }
  }
}
</style>
