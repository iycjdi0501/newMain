<template>
  <div class="autocomplete-container">
    <input
      type="text"
      :value="autoCompleteList[index]"
      refs="input"
      @focus="autocompleteFieldFocusOn()"
      @blur="autocompleteFieldOff()"
      @keyup.enter="searchKeyword(), $event.target.blur()"
      @keyup.up="setSelectedSearchIndex(--index)"
      @keyup.down="setSelectedSearchIndex(++index)"
      @input="getAutoComplete($event.target.value)"
      placeholder="지역명 또는 지하철역 검색"
    />
    <div class="automatic" ref="inputAuto">
      <div
        class="auto-text"
        v-for="(text, idx) in autoCompleteList"
        :key="idx"
        @mouseover=";(selectAutomatic = text)"
        @mouseout="selectAutomatic = null"
        :class="{ selected: selectAutomatic == text, 'keyboard-select': index === idx }"
      >
        <div v-if="idx !== 0">{{ text }}</div>
      </div>
    </div>
    <button type="button" @click="searchKeyword()">
      <font-awesome-icon :icon="['fal', 'search']"></font-awesome-icon>
    </button>
  </div>
</template>
<script>
import saleHouseService from '@/service/salehouse'
export default {
  data() {
    return {
      keyword: null,
      autoCompleteList: [''],
      index: 0,
      selectAutomatic: null,
      isSearchInput: true,
      searchKeywordTimeEventValue: null
    }
  },
  methods: {
    searchKeyword() {
      clearTimeout(this.searchKeywordTimeEventValue)
      this.$refs.inputAuto.style.display = 'none'
      this.$router.push({
        name: 'SaleHouse',
        query: { keyword: this.autoCompleteList[this.index] },
      })
    },
    setSelectedSearchIndex(index) {
      if (index <= 0) {
        index = 0
      } else if (index > this.autoCompleteList.length - 1) {
        index = this.autoCompleteList.length - 1
      }
      this.index = index
      this.autoCompleteList[0] = this.autoCompleteList[index]
    },

    // 꺼지는 함수가 아니라 꺼지면서 라우터가 이동되는 함수네
    // 자동검색 필터를 클릭했을때 블러 이벤트가 발생되어 자동검색창이 꺼지기때문에
    // 마지막 마우스가 올라갔던 검색어로 자동 검색해주는 함수
    autocompleteFieldOff() {
      // setTimeout은 이벤트의 발동 시간을 뒤로 미뤄주기위해 적용
      setTimeout(() => {
        this.index = 0
        if (this.selectAutomatic) {
          this.autoCompleteList[0] = this.selectAutomatic
          this.$router.push({
            name: 'SaleHouse',
            query: { keyword: this.autoCompleteList[0] },
          })
        }
        this.$refs.inputAuto.style.display = 'none'
      }, 0)
    },
    autocompleteFieldFocusOn() {
      let autoText = this.$refs.inputAuto
      autoText.style.display = 'block'
      this.$emit('searchFocus')
    },
    getAutoComplete(keyword) {
      
      clearTimeout(this.searchKeywordTimeEventValue) 
      this.saveExistingSearchTerms(keyword)
      this.searchKeywordTimeEventValue = setTimeout(() => {
        
        saleHouseService
          .getAddressComplete(this.autoCompleteList[0])
          .then((res) => {
            this.$refs.inputAuto.style.display = 'block'
            this.autoCompleteList = [this.autoCompleteList[0], ...res.data]
            if(res.data.length < 1){
              this.$refs.inputAuto.style.display = 'none'
            }
          })
          .catch((err) => {
            console.log(err)
          })
          
      }, 200)
          
      // 입력할때는 이벤트 변수에 담아서 0.2초 뒤에 실행하게 하는데
      // 또 추가입력하면 이친구 계속 초기화해서 
    },
    saveExistingSearchTerms(searchKeyword) {
      this.autoCompleteList[0] = searchKeyword
      this.index = 0
    },
  },
}
</script>
<style lang="scss" scoped>
.autocomplete-container {
  display: flex;
  flex-grow: 1;
  position: relative;
  input {
    width: 100%;
    padding: 0 2%;
    flex-grow: 1;
    border: 1px solid $border-disable;
    border-right: 0;
  }
  input:focus{
    outline: none;
  }
  button {
    border: 1px solid $border-disable;
    border-left: 0;
    background: none;
    cursor: pointer;
    padding: 1%;
    aspect-ratio: 1 / 1;
    font: {
      size: 1.3em;
    }
  }
  .automatic::-webkit-scrollbar {
    display: none;
  }
  .automatic {
    width: 100%;
    height: auto;
    position: absolute;
    overflow-y: scroll;
    border: 1px solid #d6d6d6;
    top: 47px;
    background: $color-contrast;
    z-index: 500;
    display: none;
    .auto-text {
      font-size: 1em;
      padding: 0 2%;
      // height: 1.8em;
      cursor: pointer;
    }
    .selected {
      background: #f0f0f0;
    }
    .keyboard-select{
      background: rgba(220, 219, 220);
    }
  }
}
@media (max-width: 1024px) {
  .autocomplete-container {
    flex-grow: 0;
    width: 70%;
    border-right: 1px solid #000;
    input {
      height: 100%;
      font-size: 1em;
      border: 0 !important;
    }
    input:focus {
      outline: none;
    }
    button {
      display: none;
    }
    .automatic{
      top: 28px;
      height: 210px;
      .auto-text{
        font-size: 0.9em;
        font-weight: 400;
        margin-bottom: 0.5em;
      }
    }
  }
}
</style>
