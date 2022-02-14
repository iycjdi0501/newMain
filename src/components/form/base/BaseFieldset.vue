<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <slot />
  </fieldset>
</template>

<script>
export default {
  props: {
    legend: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
fieldset {
  border: none;

  legend {
    width: 100%;
    padding: 0.6em 0.3em;
    border-bottom: 2px solid $border-section;
    font: {
      size: 1.375em;
      weight: 400;
    }
  }
}
</style>
