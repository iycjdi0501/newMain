<template>
  <div class="building">
    <div class="title" :class="{ require: required }" :style="{ 'width': width }">
      주소
    </div>
    <div class="flex-box">
      <div class="address-box">
        <input
          type="text"
          class="address"
          v-model="jibunAddress"
          readonly
          @input="$emit('jibunAddress', $event)"
        />
        <search-address
          @jibunAddress="jibunAddress = $event"
          @coordinate="$emit('coordinate', $event)"
        >
          <div class="search-box">
            <font-awesome-icon :icon="['fal', 'search']" />
          </div>
        </search-address>
      </div>
      <div class="building-box">
        <div class="building">
          <div class="title">동</div>
          <input
            type="number"
            v-model="building"
            :disabled="noneBuilding"
            @input="$emit('building', building)"
          />
        </div>
        <div class="building">
          <div class="title">호수</div>
          <input type="number" v-model="unit" @input="$emit('unit', unit)" />
        </div>
      </div>
      <div class="check-box">
        <base-checkbox
          label="동 정보가 없는 경우 체크 해주세요."
          v-model:modelValue="noneBuilding"
          @input="removeBuildingValue"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import SearchAddress from '@/components/tool/SearchAddress'
export default {
  components: { BaseCheckbox, SearchAddress },
  props: {
    required: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '8em',
    },
  },
  data() {
    return {
      coordinate: {},
      building: '',
      unit: '',
      jibunAddress: null,
      noneBuilding: false,
    }
  },
  methods: {
    removeBuildingValue(event) {
      this.noneBuilding = event.target.checked
      this.building = ''
      this.$emit('building', '')
      this.$emit('noneBuilding', this.noneBuilding)
    },
  },
}
</script>

<style lang="scss" scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input:focus {
  outline: 1px solid $color-primary;
}
.building {
  display: flex;
  gap: 1em;
  .title {
    font-weight: 500;
    font-size: 1.125em;
  }
  .require:before {
    content: '⁕';
    margin-right: 0.25em;
    color: $color-error;
    font: {
      size: 1.5em;
    }
  }
  .flex-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1em;
    .address-box {
      display: flex;
      .address {
        flex-grow: 1;
        border: 1px solid #d6d6d6;
        padding: 0.7em;
      }
      button {
        padding: 0;
      }
      .search-box {
        border: 1px solid #d6d6d6;
        width: 50px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 2em;
      }
    }
    .building-box {
      display: flex;
      justify-content: space-between;
      .building {
        width: 45%;
        .title {
          width: 20%;
          line-height: 40px;
        }
        input {
          width: 60%;
          border: 1px solid #d6d6d6;
          padding: 0.7em;
        }
        display: flex;
      }
    }
  }
}

@media (max-width: 1024px){
  .building{
    width: 100%;
    .flex-box{
      flex-grow: 1;
      .building-box{
        .building{
          .title{
            width: 40%;
          }
        }
      }
    }
  }
}
</style>
