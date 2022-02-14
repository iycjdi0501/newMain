<template>
  <div class="loading-content">
    <img src="@/assets/icon/A-part_loading_white.gif" alt="loading img" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.loading-content {
  padding: 1em;
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: -75px;
  margin-bottom: -75px;
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    width: 100px;
    height: auto;
  }
}
</style>
