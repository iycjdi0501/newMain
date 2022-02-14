<template>
  <div class="cover">
    <label>{{ label }}</label>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.cover {
  flex-grow: 1;
  display: flex;
  border-bottom: 1px solid $border-disable;
  gap: 1em;

  label {
    width: 12.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    background-color: $background-foundation;
    font: {
      size: 1.25em;
      weight: 400;
    }
  }

  > div {
    flex-grow: 1;
  }
}

@media (max-width: 1024px) {
  .cover {
    label {
      width: 6em;
    }
  }
}
</style>
