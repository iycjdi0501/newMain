<template>
  <button class="search-address-container" type="button" @click="searchAddress">
    <slot class="btn" />
  </button>
</template>

<script>
export default {
  methods: {
    searchAddress() {
      // eslint-disable-next-line no-undef
      new daum.Postcode({
        oncomplete: (data) => {
          const roadAddress =
            (data.roadAddress || data.autoRoadAddress)

          const jibunAddress = data.jibunAddress || data.autoJibunAddress
          
          this.$emit('jibunAddress', jibunAddress)
          this.$emit('roadAddress', roadAddress)
          this.$emit('address', data.address)
          this.$emit('fullData', data)
          this.$emit('buildingName', data.buildingName)
          
          const geocoder = new daum.maps.services.Geocoder();
          
          geocoder.addressSearch(data.address, (result, status) => {
            if(status === daum.maps.services.Status.OK){
              const {x, y} = result[0]

              this.$emit('coordinate', {latitude: y, longitude: x})
            }
          })
        },
      }).open()
    },
    addScript() {
      const script = document.createElement('script')
      script.classList.add('location')
      script.setAttribute(
        'src',
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      )
      document.head.appendChild(script)
    },
    removeScript() {
      const removeItems = document.head.querySelectorAll('.location')
      removeItems.forEach((item) => {
        item.remove()
      })
    },
  },
  mounted() {
    this.addScript()
  },
  unmounted() {
    this.removeScript()
  },
}
</script>

<style lang="scss" scoped>
 .search-address-container{
   background-color: transparent;
   border: 0;
   padding: 0;
   .btn{
   }
 }
</style>
