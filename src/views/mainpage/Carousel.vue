<template>
  <div class="carousel">
    <slot></slot>
    <div class="left-cursor" @click="leftClick"><font-awesome-icon :icon="['fas', 'angle-left']"></font-awesome-icon></div>
    <div class="right-cursor" @click="rightClick"><font-awesome-icon :icon="['fas', 'angle-right']"></font-awesome-icon></div>
  </div>
</template>

<script>
export default {
  created() {
    setInterval(() => {
      this.rightClick();
    }, 15000);
  },
  methods: {
    leftClick : function() {
      this.$store.dispatch('leftClick');
      this.$store.dispatch('leftClick_changeBg');
    },
    rightClick : function() {
      this.$store.dispatch('rightClick');
    }
  }
}
</script>

<style lang="scss" scoped>
  .carousel{
    width: 100%;
    height: 300px;
    margin-top: 1rem;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  .left-cursor{
    position: absolute;
    color: white;
    font-size: 30px;
    left: 100px;
    top: calc(50% - 15px);
    cursor: pointer;
    transition: all 0.5s;
  }
  .left-cursor:hover{
    transform: scale(1.2);
  }
  .right-cursor{
    position: absolute;
    color: white;
    font-size: 30px;
    right: 100px;
    top: calc(50% - 15px);
    cursor: pointer;
    transition: all 0.5s;
  }
  .right-cursor:hover{
    transform: scale(1.2);
  }
</style>