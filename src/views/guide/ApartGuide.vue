<template>
  <div ref="container">
    <img src="@/assets/image/apart-guide.svg" alt="에이파트 설명서" />
    <Footer v-if="isMobile" />
  </div>
</template>

<script>
import Footer from '@/components/template/Footer'
import { mapGetters } from 'vuex'
export default {
  components: { Footer },
  computed: {
    ...mapGetters(['isMobile']),
  },
  mounted() {
    if(this.$route.query.offSet === 'bottom'){
      window.scrollTo(0, this.$refs.container.scrollHeight)
    }
  },
}
</script>

<style scoped>
img {
  width: 100%;
  max-width: 1920px;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
