export const sale = {
  state: () => ({
    filterData: {
      // floor: '지상,반지하,옥탑',
      houseType: '오피스텔,아파트',
      point: '',
      rentalCost: '0,100000000',
      salePrice: '0,100000000',
      deposit: '0,100000000',
      monthlyRentCost: '0,100000000',
    },
  }),
  mutations: {
    SET_FILTER(state, filterData) {
      filterData.point = ''
      state.filterData = filterData
    },
    RESET_FILTER(state) {
      state.filterData = {
        // floor: '지상,반지하,옥탑',
        houseType: '오피스텔,아파트',
        point: '',
        rentalCost: '0,100000000',
        salePrice: '0,100000000',
        deposit: '0,100000000',
        monthlyRentCost: '0,100000000',
      }
    },
  },
}
