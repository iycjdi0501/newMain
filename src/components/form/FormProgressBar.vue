<template>
  <div class="form-progress-container">
    <ul class="progress-steps">
      <li
        :class="{ active: formIndex >= idx + 1 }"
        v-for="(section, idx) in sections"
      >
        {{ section }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    formIndex: {
      type: Number,
      required: true,
    },
    sections: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.form-progress-container {
  margin: 2em 0;
  display: block;
  .title {
    font-size: 2em;
    font-weight: 400;
  }
  $body-color: #999;

  .progress-container {
    width: 100%;
    margin: 0 auto;
  }
  .progress-steps {
    counter-reset: step;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .progress-steps li {
    list-style-type: none;
    width: calc(100% / 7);
    font-size: 1.15em;
    font-weight: 500;
    position: relative;
    text-align: center;
    text-transform: uppercase;
    color: $body-color;
  }
  .progress-steps li:before {
    width: 2.5em;
    height: 2.5em;
    content: counter(step);
    counter-increment: step;
    line-height: 2.5em;
    border: 2px solid $body-color;
    display: block;
    text-align: center;
    margin: 0 auto 0.7em auto;
    border-radius: 50%;
    background-color: white;
  }
  .progress-steps li:after {
    width: 100%;
    height: 2px;
    content: '';
    position: absolute;
    background-color: $body-color;
    top: 1.3em;
    left: -50%;
    z-index: -1;
  }
  .progress-steps li:first-child:after {
    content: none;
  }
  .progress-steps li.active {
    color: $color-primary;
  }
  .progress-steps li.active:before {
    border-color: $color-primary;
  }
  .progress-steps li.active + li:after {
    background-color: $color-primary;
  }
}
@media (max-width: 1024px) {
  .progress-steps li:before {
    width: 2em !important;
    height: 2em !important;
    line-height: 2em !important;
  }
  .progress-steps li:after {
    top: 1.1em !important;
  }
}
</style>
