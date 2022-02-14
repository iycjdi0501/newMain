<template>

  <div class="carousel-slide" v-show="visibleSlide == index">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props : ['visibleSlide', 'index']
}
</script>

<style>
  .carousel-slide{
    margin: auto;
    overflow: hidden;
  }
  /* .left-enter-active{
    animation: leftInAnimation 0.5s ease-in-out;
  }
  .left-leave-active{
    animation: leftOutAnimation 0.5s ease-in-out;
  }
  @keyframes leftInAnimation{
    from{ transform: translateX(100%);}
    to{ transform: translateX(0%);}
  }
  @keyframes leftOutAnimation{
    from{ transform: translateX(0);}
    to{ transform: translateX(-100%);}
  }
  .right-enter-active{
    animation: rightInAnimation 0.5s ease-in-out;
  }
  .right-leave-active{
    animation: rightOutAnimation 0.5s ease-in-out;
  }
  @keyframes rightInAnimation{
    from{ transform: translateX(-100%);}
    to{ transform: translateX(0%);}
  }
  @keyframes rightOutAnimation{
    from{ transform: translateX(0);}
    to{ transform: translateX(100%);}
  } */
</style>