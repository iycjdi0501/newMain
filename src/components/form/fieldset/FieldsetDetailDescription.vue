<template>
  <base-fieldset legend="상세 설명" class="fieldset-detail-description">
    <ul class="caution">
      <li>
        상세 정보는 최소 50자 이상 최대 1000자 이내로 작성해야 하며, 비공개
        메모는 50자 이내로 작성하실 수 있습니다.
      </li>
      <li>
        비공개 메모는 작성자와 관리자만 확인할 수 있습니다. 관리자에게 전달하고
        싶은 내용을 작성 할 수 있습니다.
      </li>
      <li>
        개인정보를 포함하여 게시하는 경우에는 불특정 다수에게 개인정보가
        노출되어 악용될 수 있으며, 특히 타인의 개인정보가 노출되는 경우에는
        개인정보보호법에 따라 처벌을 받을 수 있음을 알려드립니다.
      </li>
      <li>
        광고성, 종교적, 정치적, 선정적, 비속어, 비방성, 음해성 등 불건전한
        내용을 담고 있을 경우에는 서비스 이용에 불이익이 발생 할 수 있으며
        경우에 따라 법적 책임이 따를 수 있습니다.
      </li>
    </ul>
    <base-textarea
      class="border-top"
      :theme="isMobile ? 'column' : 'fieldset-slot'"
      label="상세 정보"
      placeholder="판매할 집에 대한 상세정보를 최소 50자 이상 적어주세요.&#10;&#10;위치 / 교통 / 편의시설 등 장점과 특징에 대해 적어주세요."
      minlength="50"
      maxlength="1000"
      :model-value="description"
      @update:model-value="descriptionUpdate"
    >
      <error-field v-if="errors" :errors="errors" :margin="'0 0 0.5em 1em'" />
    </base-textarea>
    <base-input
      :theme="isMobile ? 'column' : 'fieldset'"
      label="비공개 메모"
      placeholder="관리자에게 전달할 메세지를 입력해주세요."
      type="text"
      maxlength="50"
      :model-value="privateMemo"
      @update:model-value="$emit('update:privateMemo', $event)"
    />
  </base-fieldset>
</template>

<script>
import BaseFieldset from '@/components/form/base/BaseFieldset'
import BaseInput from '@/components/form/base/BaseInput'
import BaseTextarea from '@/components/form/base/BaseTextarea'
import { mapGetters } from 'vuex'
import ErrorField from '@/components/form/ErrorField'

export default {
  components: { ErrorField, BaseTextarea, BaseInput, BaseFieldset },
  computed: {
    ...mapGetters(['isMobile']),
  },
  props: {
    description: {
      type: String,
      default: '',
    },
    privateMemo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      errors: [],
    }
  },
  methods: {
    confirm() {
      const errors = []

      if (
        !(this.description
          ? this.description.length >= 50 && this.description.length <= 1000
          : false)
      ) {
        errors.push('상세 정보를 작성해주세요.')
      }

      this.errors = errors
      this.$emit('update:errors', this.errors)
    },
    descriptionUpdate(event) {
      this.confirm()
      this.$emit('update:description', event)
    }
  },
}
</script>

<style lang="scss" scoped>
.fieldset-detail-description {
  .caution {
    list-style-position: inside;
    padding: 0 1em;

    li {
      margin: 0.5em 0;
      font: {
        weight: 400;
      }

      &::marker {
        font-size: 0.1em;
      }
    }
  }

  .border-top {
    border-top: 1px solid $border-disable;
  }
}
</style>
