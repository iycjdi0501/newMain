<template>
  <div class="direction-container double">
    <cover label="방향" class="cover">
      <div class="flex-box">
        <base-select
          label="일조 방향"
          :options="directionOptions"
          :model-value="direction"
          @update:model-value=";(directionData = $event), confirm()"
        />
        <base-select
          label="난방 방식"
          :options="heatingTypeOptions"
          :model-value="heatingType"
          @update:model-value=";(heatingTypeData = $event), confirm()"
        />
      </div>
      <error-field :errors="errors" />
    </cover>
  </div>
</template>
<script>
import Cover from '@/components/form/Cover'
import BaseSelect from '@/components/form/base/BaseSelect'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { Cover, BaseSelect, ErrorField },
  props: {
    direction: {
      type: String,
      default: '',
    },
    heatingType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      directionOptions: [
        {
          label: '동',
          value: '동',
        },
        {
          label: '서',
          value: '서',
        },
        {
          label: '남',
          value: '남',
        },
        {
          label: '북',
          value: '북',
        },
        {
          label: '남동',
          value: '남동',
        },
        {
          label: '북동',
          value: '북동',
        },
        {
          label: '남서',
          value: '남서',
        },
        {
          label: '북서',
          value: '북서',
        },
      ],
      heatingTypeOptions: [
        {
          label: '중앙난방',
          value: '중앙난방',
        },
        {
          label: '개별난방',
          value: '개별난방',
        },
        {
          label: '지역난방',
          value: '지역난방',
        },
      ],
      heatingTypeData: this.heatingType,
      directionData: this.direction,
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.errors = []

      if (
        !['동', '서', '남', '북', '남동', '북동', '남서', '북서'].includes(
          this.directionData
        )
      ) {
        error = '일조 방향을 선택해주세요.'
        errors.push(error)
      }

      if (
        !['중앙난방', '개별난방', '지역난방'].includes(this.heatingTypeData)
      ) {
        error = '난방 방식을 선택해주세요.'
        errors.push(error)
      }

      this.errors = errors
      this.$emit('update:direction', this.directionData)
      this.$emit('update:heatingType', this.heatingTypeData)
      this.$emit('update:errors', this.errors)
    },
  },
}
</script>

<style lang="scss" scoped>
.double {
  .flex-box {
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
    padding: 1em;

    .half {
      width: 50%;

      span {
        align-self: center;
        margin-right: 2em;
      }
    }
  }
}

@media (max-width: 1024px) {
  .double {
    .flex-box {
      .half {
        width: 100%;
      }
    }
  }
}
</style>
