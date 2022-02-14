<template>
  <div class="email">
    <label v-if="label">
      {{ label }}
    </label>
    <div class="email-box">
      <base-input v-model="id" @change="$emit('update:modelValue', email)" />
      @
      <base-input
        v-model="domain"
        @change="$emit('update:modelValue', email)"
      />
      <base-select
        v-model="domain"
        :options="domainOptions"
        @change="$emit('update:modelValue', email)"
      />
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/form/base/BaseInput'
import BaseSelect from '@/components/form/base/BaseSelect'

export default {
  components: { BaseSelect, BaseInput },
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: '',
      domain: '',
      domainOptions: [
        'naver.com',
        'daum.net',
        'gmail.com',
        'outlook.com',
        'nate.com',
      ],
    }
  },
  computed: {
    email() {
      if (this.id && this.domain) {
        return `${this.id}@${this.domain}`
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.email {
  display: flex;
  align-items: center;
  gap: 1em;

  label {
    width: 6em;
    flex-shrink: 0;
    font: {
      size: 1.125em;
      weight: 500;
    }
  }

  .email-box {
    width: 0;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 0.5em;

    .input {
      width: 0;
      flex-grow: 1;
    }
  }
}
</style>
