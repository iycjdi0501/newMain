<template>
  <div class="room-container">
    <cover label="공간">
      <div class="double">
        <div class="flex-box">
          <base-input
            class="half"
            label="방 개수"
            type="number"
            :model-value="roomCount"
            @update:model-value="
              ;(roomCountData = Number.parseInt($event)), confirm()
            "
          >
            <span>개</span>
          </base-input>
          <base-input
            class="half"
            label="욕실 개수"
            type="number"
            :model-value="bathroomCount"
            @update:model-value="
              ;(bathroomCountData = Number.parseInt($event)), confirm()
            "
          >
            <span>개</span>
          </base-input>
        </div>
      </div>
      <error-field :errors="errors" />
    </cover>
  </div>
</template>

<script>
import Cover from '@/components/form/Cover'
import BaseInput from '@/components/form/base/BaseInput'
import ErrorField from '@/components/form/ErrorField'
export default {
  components: { BaseInput, ErrorField, Cover },
  props: {
    roomCount: {
      type: Number,
      default: null,
    },
    bathroomCount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      roomCountData: this.roomCount,
      bathroomCountData: this.bathroomCount,
      errors: [],
    }
  },
  methods: {
    confirm() {
      let errors = []
      let error
      this.errors = []

      if (
        !(typeof this.roomCountData === 'number' && !isNaN(this.roomCountData))
      ) {
        error = '방 개수를 입력해주세요.'
        errors.push(error)
      } else if (this.roomCountData > 100) {
        error = '방 개수는 최대 100개까지 입력하실 수 있습니다.'
        errors.push(error)
      }

      if (
        !(
          typeof this.bathroomCountData === 'number' &&
          !isNaN(this.bathroomCountData)
        )
      ) {
        error = '욕실 개수를 입력해주세요.'
        errors.push(error)
      } else if (this.bathroomCountData > 100) {
        error = '욕실 개수는 최대 100개까지 입력하실 수 있습니다.'
        errors.push(error)
      }

      this.errors = errors
      this.$emit('update:roomCount', this.roomCountData)
      this.$emit('update:bathroomCount', this.bathroomCountData)
      this.$emit('update:errors', this.errors)
    },
  },
}
</script>

<style lang="scss" scoped>
.double {
  padding: 1em;
  .flex-box {
    display: flex;
    flex-wrap: wrap;

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
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 1em;

      .half {
        width: 100%;

        span {
          align-self: center;
          margin-right: 2em;
        }
      }
    }
  }
}
</style>
