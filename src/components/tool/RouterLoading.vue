<template>
  <div class="loading-container">
    <div class="loading-content">
      <img src="@/assets/icon/A-part_loading_white.gif" alt="loading img" />
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.loading-container{
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  top: 0;
  display:flex;
  justify-content: center;
  align-items: center;
.loading-content {
  padding: 1em;
  border-radius: 30%;
  background: $color-contrast;
  margin-bottom: 15vh;
  img {
    width: 100px;
    height: auto;
  }
}
}
</style>