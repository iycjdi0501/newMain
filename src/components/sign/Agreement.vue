<template>
  <div class="agreement_container">
    <ul>
      <li>
        <base-checkbox label="서비스 이용약관" v-model="service" />
        <font-awesome-icon :icon="['fal', 'chevron-right']" />
      </li>
      <li>
        <base-checkbox label="개인정보 수집 및 이용 동의" v-model="privacy" />
        <font-awesome-icon :icon="['fal', 'chevron-right']" />
      </li>
      <li>
        <base-checkbox
          label="마케팅 수신 정보 동의 (선택)"
          v-model="marketing"
        />
      </li>
      <li>
        <base-checkbox
          label="이용약관 모두동의"
          v-model="allAgree"
          @click="agreeToAllTerms"
        />
      </li>
    </ul>
    <base-button
      type="button"
      :disabled="!agreed"
      @click="$emit('agree', { service, privacy, marketing })"
    >
      확인
    </base-button>
  </div>
</template>

<script>
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import BaseButton from '@/components/form/base/BaseButton'

export default {
  components: { BaseButton, BaseCheckbox },
  data() {
    return {
      service: false,
      privacy: false,
      marketing: false,
    }
  },
  computed: {
    agreed() {
      return this.service && this.privacy
    },
    allAgree() {
      return this.service && this.privacy && this.marketing
    },
  },
  methods: {
    agreeToAllTerms() {
      if (!this.allAgree) {
        this.service = true
        this.privacy = true
        this.marketing = true
      } else {
        this.service = false
        this.privacy = false
        this.marketing = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.agreement_container {
  width: 27.5em;
  display: flex;
  flex-direction: column;
  gap: 2em;

  ul {
    list-style-type: none;

    > li {
      padding: 1em 0.5em 1em 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    > li:not(li:last-child) {
      border-bottom: 1px solid $border-disable;
    }
  }
}
</style>
