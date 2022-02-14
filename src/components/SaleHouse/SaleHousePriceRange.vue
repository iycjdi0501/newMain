<template>
  <div class="content">
    <div class="title">{{ title }}</div>
    <div class="box-range">
      <div class="range">
        <input
          type="text"
          :value="priceFormatter.insertComma(priceComputed[0])"
          @input="priceRemodeling(0, $event.target)"
          
        />
        <div>만원</div>
        ~
        <input
          type="text"
          :value="priceFormatter.insertComma(priceComputed[1])"
          @input="priceRemodeling(1, $event.target)"
        />
        <div>만원</div>
      </div>
      <div class="total">
        {{ totalMoney || '전체' }}
      </div>
    </div>
  </div>
</template>
<script>

import * as priceFormatter from '@/modules/priceFormatter'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    maxLength: {
      type: Number,
      default: 9,
    },
    priceList: {
      type: Array,
    },
    priceSet: {
      type: String,
    }
  },
  computed:{
    priceComputed(){
      this.price = this.priceSet ? String(this.priceSet).split(',') : [0, 100000000]
      this.totalMoney = this.total(Number(this.price[0]), Number(this.price[1]))
      return this.price
    }
  },
  data() {
    return {
      price: this.priceSet ? String(this.priceSet).split(',') : [0, 100000000],
      totalMoney: null,
      computedPriceSetTimer: true,
      priceFormatter: priceFormatter,
    }
  },
  mounted() {
    this.totalMoney = this.total(Number(this.price[0]), Number(this.price[1]))
    this.$emit('update:priceSet', this.price.join(','))
  },
  methods: {
    priceRemodeling(index, event) {
      let value = priceFormatter.extractNumber(event.value)
      if (value > 100000000) {
        value = 100000000
      }
      if (value <= 0) {
        value = 0
      }
      this.price[index] = value

      if (!value) {
        this.price[index] = 0
      }
      if (value > 100000000) this.price[index] = 100000000
      if (value < 0) this.price[index] = 0
      if (Number(this.price[0]) > Number(this.price[1])) this.price[1] = this.price[0]

      this.price[index] = value
      if (this.price[0] === this.price[1]) {
        this.$emit('update:priceSet', '0, 100000000')
      } else {
        this.$emit('update:priceSet', this.price.join(','))
      }

      this.totalMoney = this.total(Number(this.price[0]), Number(this.price[1]))
      this.price[index] = priceFormatter.insertComma(value)
    },
    total(min, max) {
      if (min === 0 && max === 0) {
        return '전체'
      } else if (min === 0 && max === 100000000 ) {
        return '전체'
      } else if (min === 0 && max) {
        return this.formatting(max) + ' 까지'
      } else if (min && max === 100000000) {
        return this.formatting(min) + ' 부터'
      } else if (min > max) {
        return '최소값이 최대값보다 큽니다.'
      } else {
        return this.formatting(min) + ' ~ ' + this.formatting(max)
      }
    },
    formatting(data) {
      let result, unit
      if (!data) return
      if (data >= 10000) {
        unit = parseInt(data / 10000)
        data = data - unit * 10000
      }
      if (!unit) {
        result = data + '만원'
      } else if (data !== 0) {
        result = unit + '억 ' + data + '만원'
      } else {
        result = unit + '억'
      }
      return result
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
.content {
  .title {
    font-size: 1.15em;
    font-weight: 400;
    margin-bottom: 5%;
  }
  .box-range {
    display: flex;
    flex-wrap: wrap;
    .range {
      width: 350px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      input {
        font-size: 20px;
        width: 35%;
        padding: 0 1%;
        text-align: right;
        height: 34px;
        border: 1px solid #d6d6d6;
      }
      div {
        color: #767676;
      }
    }
  }
  .total {
    width: 100%;
    text-align: left;
    font-size: 1.9em;
    color: $color-primary;
    font-weight: 500;
    margin-bottom: 8%;
  }
}
</style>
