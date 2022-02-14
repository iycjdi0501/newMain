<template>
  <a class="kakao" @click="savePreviousPath" :href="authCodeUrl">
    <img src="@/assets/icon/Kakao_Symbol.svg" />카카오 로그인
  </a>
</template>

<script>
import kakao from '@/modules/kakao'

export default {
  data() {
    return {
      authCodeUrl: kakao.getKakaoAuthCodeUrl(),
    }
  },
  methods: {
    savePreviousPath() {
      localStorage.setItem('previous-path', String(this.$route.path))
    },
  },
}
</script>

<style lang="scss" scoped>
.kakao {
  padding: 3%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000d8;
  background-color: #fee500;
  text-decoration: none;
  border-radius: 12px;
  font: {
    size: 1.125em;
    weight: 400;
  }

  img {
    width: 7%;
    height: auto;
    position: absolute;
    left: 1em;
  }
}
</style>
