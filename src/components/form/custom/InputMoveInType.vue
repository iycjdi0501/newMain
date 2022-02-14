<template>
  <div class="move-in-data-container">
    <cover :label="moveInTypes.label" class="cover">
      <div class="flex-box">
        <base-radio
          theme="fieldset"
          v-for="option in moveInTypes.options"
          :label="option.label"
          :value="option.value"
          :name="moveInTypes.name"
          :model-value="moveInType"
          :theme="'default'"
          @update:model-value=";(moveInTypeData = $event), confirm()"
        />
        <transition name="fade">
          <date-picker
            v-if="moveInType === '날짜 선택'"
            :model-value="moveInDate"
            @update:model-value=";(moveInDateData = $event), confirm()"
            :model-config="{
              type: 'string',
              mask: 'YYYY-MM-DD',
            }"
            color="blue"
            title-position="left"
            trim-weeks
            :min-date="new Date()"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <base-input :model-value="inputValue" v-on="inputEvents" disabled
                >이후
              </base-input>
            </template>
          </date-picker>
        </transition>
      </div>
      <error-field :errors="errors" />
    </cover>
  </div>
</template>

<script>
import Cover from '@/components/form/Cover'
import BaseRadio from '@/components/form/base/BaseRadio'
import BaseInput from '@/components/form/base/BaseInput'
import ErrorField from '@/components/form/ErrorField'
import { DatePicker } from 'v-calendar'
export default {
  components: { Cover, BaseInput, BaseRadio, ErrorField, DatePicker },
  props: {
    moveInType: {
      type: String,
      default: '',
    },
    moveInDate: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      moveInTypeData: this.moveInType,
      moveInDateData: this.moveInDate,
      moveInTypes: {
        label: '입주 가능일',
        name: 'move-in-type',
        options: [
          {
            label: '즉시 입주',
            value: '즉시 입주',
          },
          {
            label: '날짜 협의',
            value: '날짜 협의',
          },
          {
            label: '날짜 선택',
            value: '날짜 선택',
          },
        ],
      },
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.errors = []

      if (
        !['즉시 입주', '날짜 협의', '날짜 선택'].includes(this.moveInTypeData)
      ) {
        error = '입주 가능일을 선택해주세요.'
        errors.push(error)
      }

      if (this.moveInTypeData === '날짜 선택' && !this.moveInDateData) {
        error = '입주 희망 날짜를 선택해주세요.'
        errors.push(error)
      }

      this.$emit('update:moveInType', this.moveInTypeData)
      this.$emit('update:moveInDate', this.moveInDateData)
      this.$emit('update:errors', errors)
      this.errors = errors
    },
  },
}
</script>

<style lang="scss" scoped>
.flex-box {
  padding: 1em;
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}
</style>
