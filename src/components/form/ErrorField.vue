<template>
  <div class="errors" :style="{'margin' : margin}">
    <div v-for="(error, idx) in errors" :key="idx">{{error}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      errors: {
        type: Array,
        required: false,
        default: []
      },
      margin: {
        type: String,
        required: false,
        default: '0 0 0.5em 1em'
      }
    }
  }
</script>

<style lang="scss" scoped>
.errors {
    color: #ff0000;
    font-size: 0.9em;
  }
</style>