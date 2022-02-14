<template>
  <div class="price-date" :class="theme">
    <label v-if="label">{{ label }}</label>
    <div class="content">
      <base-input
        label="금액"
        type="text"
        placeholder="만원"
        align="right"
        :useType="'price'"
        :model-value="price"
        @update:model-value="$emit('update:price', $event)"
      >
        만원
      </base-input>
      <base-input
        label="날짜"
        type="date"
        :min="min"
        :max="max"
        :model-value="date"
        @update:model-value="$emit('update:date', $event)"
      />
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'

export default {
  name: 'PriceDate',
  components: { BaseInput },
  props: {
    label: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'default',
    },
    price: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.price-date {
  display: flex;
  gap: 1em;
  align-items: center;

  > label {
    flex-shrink: 0;
    font: {
      size: 1.125em;
      weight: 500;
    }
  }

  .content {
    display: flex;
    gap: 1em;
    flex-grow: 1;
  }

  &.fixed-7 {
    label {
      width: 7em;
    }
  }

  &.fixed-8 {
    label {
      width: 8em;
    }
  }
}

@media (max-width: 1024px) {
  .content {
    flex-direction: column;
    font-size: 0.8em;
  }
}
</style>
