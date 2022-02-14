<template>
  <base-fieldset legend="추가 정보">
    <div class="double">
      <base-radio-group
        class="half"
        theme="fieldset"
        label="주차"
        name="parking"
        :options="possibleOptions"
        :model-value="parking.toString()"
        @update:model-value="$emit('update:parking', $event === 'true')"
      />
      <base-radio-group
        class="half"
        theme="fieldset"
        label="엘리베이터"
        name="elevator"
        :options="existenceOptions"
        :model-value="elevator.toString()"
        @update:model-value="$emit('update:elevator', $event === 'true')"
      />
    </div>
    <div class="double">
      <base-radio-group
        class="half"
        theme="fieldset"
        label="반려동물"
        name="pet"
        :options="possibleOptions"
        :model-value="pet.toString()"
        @update:model-value="$emit('update:pet', $event === 'true')"
      />
      <base-radio-group
        class="half"
        theme="fieldset"
        label="빌트인"
        name="builtIn"
        :options="existenceOptions"
        :model-value="builtIn.toString()"
        @update:model-value="$emit('update:builtIn', $event === 'true')"
      />
    </div>
    <cover label="옵션">
      <div class="flex-box">
        <base-checkbox
          v-for="(houseOption, idx) in houseOptions"
          :key="idx"
          theme="fieldset"
          :label="houseOption"
          :model-value="option.includes(houseOption)"
          @update:model-value="updateOptions($event, houseOption)"
        />
      </div>
    </cover>
  </base-fieldset>
</template>

<script>
import BaseFieldset from '@/components/form/base/BaseFieldset'
import BaseCheckbox from '@/components/form/base/BaseCheckbox'
import BaseRadioGroup from '@/components/form/base/BaseRadioGroup'
import Cover from '@/components/form/Cover'

export default {
  components: { Cover, BaseCheckbox, BaseRadioGroup, BaseFieldset },
  props: {
    transactionType: {
      type: String,
      default: '',
      required: true,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    elevator: {
      type: Boolean,
      default: false,
    },
    pet: {
      type: Boolean,
      default: false,
    },
    builtIn: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      text: null,
      possibleOptions: [
        {
          label: '가능',
          value: 'true',
        },
        {
          label: '불가능',
          value: 'false',
        },
      ],
      existenceOptions: [
        {
          label: '있음',
          value: 'true',
        },
        {
          label: '없음',
          value: 'false',
        },
      ],
      selectedOptions: this.option,
      selectedMethods: this.tradingMethods,
      houseOptions: ['가스레인지', '인덕션', '냉장고', '세탁기', '에어컨', '전자레인지', 'TV', '옷장', '침대', '책상', '신발장', '비데', '도어락', '싱크대']
    }
  },
  created() {
    this.$emit('update:parking', this.parking)
    this.$emit('update:elevator', this.elevator)
    this.$emit('update:pet', this.pet)
    this.$emit('update:builtIn', this.builtIn)
  },
  methods: {
    updateOptions(checked, value) {
      if (checked) {
        this.selectedOptions.push(value)
      } else {
        this.selectedOptions = this.selectedOptions.filter(
          (item) => item !== value
        )
      }
      this.$emit('update:option', this.selectedOptions)
    },
    updateTradingMethod(checked, value) {
      if (checked) {
        this.selectedMethods.push(value)
      } else {
        this.selectedMethods = this.selectedMethods.filter(
          (item) => item !== value
        )
      }
      this.$emit('update:tradingMethods', this.selectedMethods)
    },
  },
}
</script>

<style lang="scss" scoped>
.double {
  display: flex;

  .half {
    width: 50%;
  }
}

.half-box {
  display: flex;
  gap: 1em;
  padding: 1.5em 1em;
}

.flex-box {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  padding: 1em;
}

.direction-contract {
  margin: -1em -1em -1em;
  list-style-position: inside;
  color: $color-error;
  font: {
    size: 10px;
  }
}

@media (max-width: 1024px) {
  .double {
    display: flex;
    flex-wrap: wrap;

    .half {
      width: 100%;
    }
  }

  .flex-box {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    padding: 1em 1em;
  }
}
</style>
