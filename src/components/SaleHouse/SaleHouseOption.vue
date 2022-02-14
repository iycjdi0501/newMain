<template>
  <div class="content-select" :key="itemListCom?.length">
    <div class="title">{{ title }}</div>
    <div class="select">
      <sale-house-list-btn
        v-for="(item, idx) in items"
        :key="idx"
        :title="item"
        @update:value="categorySelectArray"
        :class="{ check: list.includes(item) }"
      />
    </div>
  </div>
</template>
<script>
import SaleHouseListBtn from '@/components/SaleHouse/SaleHouseListBtn'

export default {
  components: { SaleHouseListBtn },
  props: {
    items: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    itemList: {
      type: [String, Array],
    },
  },
  computed:{
    itemListCom(){
      this.list = String(this.itemList).split(',')
      this.list = this.list.filter((element) => element != 'undefined') 
      this.list = this.list.filter((element) => element != '')
      
      return this.itemList
    }
  },
  data() {
    return {
      list: String(this.itemListCom),
    }
  },
  mounted() {
    this.$emit('update:itemList', this.itemListCom)
  },
  methods: {
    checkArray(arr, item) {
      let find = arr.find((data) => {
        if (data === item) {
          return true
        }
      })
      return find
    },
    categorySelectArray(data) {
      let list = this.list

      if (list.includes(data)) {
        list = list.filter((item) => item !== data)
      } else {
        list.push(data)
      }
      this.list = list
      this.$store.commit('RESET_FILTER')
      this.$emit('update:itemList', this.list.join(','))
    },
  },
}
</script>
<style lang="scss" scoped>
.check {
  border: 2px solid ;
  color: #000;
}

.content-select {
  border-top: 1px solid #d6d6d6;
  background: $color-contrast;
  padding-top: 20px;
  padding-bottom: 5px;
  margin-bottom: 40px;

  > div {
    margin-left: 21px;
  }

  .title {
    font-size: 1.15em;
    font-weight: 400;
    margin-bottom: 1%;
  }

  .select {
    display: flex;
    flex-wrap: wrap;
  }

  .typeTitle {
    font-size: 1.5em;
    margin-bottom: 5%;
  }
}
</style>
