<template>
  <div class="btn" @click="$emit('update:value', title)">
    {{ title }}
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.btn {
  width: 110px;
  padding: 6px 0;
  border-radius: 7px;
  border: 2px solid #d6d6d6;
  text-align: center;
  margin-bottom: 0.9em;
  margin-right: 0.9em;
  cursor: pointer;
  color: #767676;
}
@media (max-width: 1024px) {
  .btn {
  width: 100px;
  }
}
</style>
