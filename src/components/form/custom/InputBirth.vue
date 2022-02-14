<template>
  <div class="birth" :class="theme">
    <label v-if="label">
      {{ label }}
    </label>
    <div class="select-box">
      <base-select
        v-model="year"
        :options="options.year"
        @change="$emit('update:modelValue', birth)"
      />
      <base-select
        v-model="month"
        :options="options.month"
        @change="$emit('update:modelValue', birth)"
      />
      <base-select
        v-model="day"
        :options="options.day"
        @change="$emit('update:modelValue', birth)"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import BaseSelect from '@/components/form/base/BaseSelect'

export default {
  components: { BaseSelect },
  props: {
    label: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      year: moment().format('YYYY'),
      month: '1',
      day: '1',
    }
  },
  computed: {
    birth() {
      return {
        year: Number.parseInt(this.year),
        month: Number.parseInt(this.month),
        day: Number.parseInt(this.day),
      }
    },
    options() {
      return {
        year: this.getYears(100, moment().format('YYYY')),
        month: this.range(12),
        day:
          this.year && this.month
            ? this.range(
                moment(`${this.year}-${this.month}`, 'YYYY-MM').daysInMonth()
              )
            : [],
      }
    },
  },
  methods: {
    getYears(range, thisYear) {
      const startYear = thisYear - range + 1
      return this.range(range, startYear)
    },
    range(size, startAt = 1) {
      return [...Array(size).keys()].map((i) => i + startAt)
    },
  },
  created() {
    this.$emit('update:modelValue', this.birth)
  },
}
</script>

<style lang="scss" scoped>
.birth {
  display: flex;
  align-items: center;
  gap: 1em;

  &.fixed-label {
    label {
      width: 5em;
    }
  }

  label {
    width: 6em;
    flex-shrink: 0;
    font: {
      size: 1.125em;
      weight: 500;
    }
  }

  .select-box {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 1em;

    select {
      width: 0;
      flex-grow: 1;
    }
  }
}
</style>
