<template>
  <div class="main-page">
    <MainTop></MainTop>
    <MainContents></MainContents>
  </div>
</template>

<script>
import MainTop from './mainpage/MainTop.vue'
import MainContents from './mainpage/MainContents.vue'
export default {
  // data () {
  //   return {
  //     datas : ['61df7ad516a5f289c92bfaed','61df7d8d5905e7506814e360','61ea5c285f95a7835e056afb','61ea5bed5f95a7835e056ad3'],
  //     houses : [],
  //   }
  // },
  components : {
    MainTop,
    MainContents,
  },
}
</script>

<style scoped>
  img{
    width: 100px;
    height: 100px;
  }
</style>