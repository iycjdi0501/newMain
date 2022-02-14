<template>
  <div class="structure-container" v-if="houseType === '오피스텔'">
    <cover class="house-type-container" label="구조">
      <span class="radio-box">
        <base-radio
          theme="fieldset"
          v-for="option in structures.options"
          :label="option.label"
          :value="option.value"
          :name="structures.name"
          :model-value="structure"
          :theme="'default'"
          @update:model-value=";(structuresData = $event), confirm()"
        />
      </span>
      <error-field v-if="errors" :errors="errors" />
    </cover>
  </div>
</template>

<script>
import BaseRadio from '@/components/form/base/BaseRadio'
import Cover from '@/components/form/Cover'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { BaseRadio, Cover, ErrorField },
  props:{
    houseType: {
      type: String,
      default: '',
    },
    structure: {
      type: String,
      default: '',
    },
  },
  computed:{
    structures() {
      let structures = {
        label: '구조',
        name: 'structure',
        options: [],
      }
      if (['원룸', '투룸', '오피스텔'].includes(this.houseType)) {
        structures.options.push({ label: '복층', value: '복층' })
        if (this.houseType === '원룸') {
          structures.options.unshift({ label: '분리형', value: '분리형' })
          structures.options.unshift({ label: '오픈형', value: '오픈형' })
        } else {
          structures.options.unshift({ label: '해당 없음', value: '해당 없음' })
        }
      }
      return structures
    },
  },
  data(){
    return{
      structuresData: this.structure,
      errors: [],
    }
  },
  methods:{
    confirm(){
      let errors = []
      let error
      this.errors = []

      if(this.houseType === '오피스텔' && !this.structuresData){
        error = '복층 구조가 아니라면 해당없음을 선택해주세요.'
        errors.push(error)
      }

      this.errors = errors
      this.$emit('update:structure', this.structuresData)
      this.$emit('update:errors', this.errors)
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-box{
  display: flex;
  gap: 1em;
  padding: 1em;
}
</style>
