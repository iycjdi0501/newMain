<template>
  <div class="address-container">
    <cover class="address-cover" label="도로명 주소">
      <div class="wrapper">
        <base-input
          :model-value="roadAddress"
          @input="$emit('update:roadAddress', $event.target.value)"
          disabled
        >
          <button type="button" class="search_button" @click="searchLocation">
            <font-awesome-icon :icon="['fal', 'search']" />
          </button>
        </base-input>
      </div>
      <error-field :errors="roadAddressError" />
    </cover>
    <cover class="address-cover" label="지번 주소">
      <div class="wrapper">
        <base-input
          :model-value="address"
          @update:model-value="$emit('update:address', $event)"
          disabled
        >
          <button type="button" class="search_button" @click="searchLocation">
            <font-awesome-icon :icon="['fal', 'search']" />
          </button>
        </base-input>
      </div>
      <error-field :errors="addressError" />
    </cover>
  </div>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'
import Cover from '@/components/form/Cover'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { BaseInput, Cover, ErrorField },
  props: {
    roadAddress: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      roadAddressError: [],
      addressError: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.roadAddressError = []
      this.addressError = []
      if (!this.roadAddress) {
        error = '도로명 주소를 입력해주세요.'
        errors.push(error)
        this.roadAddressError.push(error)
      }
      if (!this.address) {
        error = '지번 주소를 입력해주세요.'
        errors.push(error)
        this.addressError.push(error)
      }
      this.$emit('update:errors', errors)
    },
    searchLocation() {
      // eslint-disable-next-line no-undef
      new daum.Postcode({
        oncomplete: (data) => {
          const roadAddress = (data.roadAddress || data.autoRoadAddress) + (data.buildingName?` (${data.buildingName})`: '')
          this.$emit('update:roadAddress', roadAddress)

          const jibunAddress = data.jibunAddress || data.autoJibunAddress 
          this.$emit('update:address', jibunAddress)
          this.$emit('buildingName', data.buildingName)
          
          this.$emit('update:result', data.address)
        },
      }).open()
      this.confirm()
    },
  },
}
</script>
<style lang="scss" scoped>
.address-container {
  .search_button {
    width: 2.5em;
    height: 2.5em;
    margin: 0 1.5em 0 0;
    align-self: center;
    background-color: transparent;
    border: 1px solid $border-disable;
    cursor: pointer;
    color: $color-disable;
    font: {
      size: 1.25em;
    }
  }
  .address-cover {
    .wrapper {
      padding: 1em;
    }
  }
}
</style>
