<template>
  <div class="">
    <cover class="cover" :class="{ gap: !isMobile }" label="집 보여주기">
      <span class="radio-box">
        <base-radio
          v-for="option in visitableOptions"
          :label="option.label"
          :value="option.value"
          name="visitable"
          theme="fixed-1"
          :width="'12em'"
          @update:model-value=";(visitableData = $event), confirm()"
        />
      </span>
      <error-field
        v-if="visitableErrors"
        :errors="visitableErrors"
        :margin="'0 0 0.5em 1em'"
      />
    </cover>
    <cover class="cover" label="직거래 여부">
      <span class="radio-box">
        <base-radio
          :theme="'fixed-1'"
          v-for="option in directTransactionOptions"
          :label="option.label"
          :value="option.value"
          name="directTransaction"
          :width="'13em'"
          @update:model-value=";(directTransactionData = $event), confirm()"
        />
      </span>
      <error-field
        v-if="directTransactionErrors"
        :errors="directTransactionErrors"
        :margin="'0 0 0.5em 1em'"
      />
    </cover>
  </div>
</template>

<script>
import BaseRadioGroup from '@/components/form/base/BaseRadioGroup'
import BaseRadio from '@/components/form/base/BaseRadio'
import Cover from '@/components/form/Cover'
import ErrorField from '@/components/form/ErrorField'
import { mapGetters } from 'vuex'
export default {
  components: { BaseRadioGroup, BaseRadio, Cover, ErrorField },
  props: {
    visitable: {
      type: String,
      default: '',
    },
    directTransaction: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['isMobile']),
  },
  data() {
    return {
      visitableOptions: [
        {
          label: '매도인(임대인)에게 연락하여 매물을 구경할 수 있어요',
          value: 'true',
        },
        {
          label: '매물을 보여주지 않고 거래하고 싶어요',
          value: 'false',
        },
      ],
      directTransactionOptions: [
        {
          label: '직거래도 가능해요',
          value: 'true',
        },
        {
          label: '에이파트 변호사 중개를 통해서만 거래하고 싶어요',
          value: 'false',
        },
      ],
      visitableErrors: [],
      directTransactionErrors: [],
      visitableData: null,
      directTransactionData: null,
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.visitableErrors = []
      this.directTransactionErrors = []

      if (this.visitableData === null) {
        error = '보여주기 여부를 선택해주세요.'
        errors.push(error)
        this.visitableErrors.push(error)
      }
      if (this.directTransactionData === null) {
        error = '직거래 여부를 선택해주세요.'
        errors.push(error)
        this.directTransactionErrors.push(error)
      }

      if (this.visitableData && this.directTransactionData) {
        this.$emit('update:visitable', this.visitableData.toString())
        this.$emit(
          'update:directTransaction',
          this.directTransactionData.toString()
        )
      }
      this.$emit('update:errors', errors)
    },
  },
}
</script>

<style lang="scss" scoped>
.cover {
  display: flex;
  gap: 0;
  .radio-box {
    padding: 1.5em 1em;
    flex-wrap: wrap;
  }
}
.gap {
  gap: 1em;
}
</style>
