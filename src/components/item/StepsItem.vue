<template>
  <div class="steps-item">
    <div class="top-box">
      <div class="step-code">STEP - 0{{ index }}</div>
      <div class="step-title">{{ title }}</div>
    </div>
    <div class="bottom-box">
      <div class="step-description" v-html="description"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.steps-item {
  width: 250px;
  aspect-ratio: 10 / 9;
  box-shadow: $box-shadow-solid;
  border-radius: 20px;
  overflow: hidden;

  > * {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .top-box {
    background-color: $background-default;

    > * {
      margin: 1% 0;
    }

    .step-code {
      color: $color-tertiary;
      font: {
        size: 1.2em;
        weight: 500;
      }
    }

    .step-title {
      font: {
        size: 1.5em;
        weight: 400;
      }
    }
  }

  .bottom-box {
    background-color: $background-tertiary;

    .step-description {
      color: $color-contrast;
      text-align: left;
      font: {
        size: 1.2em;
      }
    }
  }
}
</style>
