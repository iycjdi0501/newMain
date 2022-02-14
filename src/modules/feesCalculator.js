export function feesCalculator(houseType, transactionInfo) {
  const rentalType = transactionInfo.type
  const price =
    rentalType === '전세'
      ? transactionInfo.rentalCost
      : rentalType === '월세'
      ? transactionInfo.deposit
      : transactionInfo.salePrice
  let maxFees
  let fees


  if (houseType !== '오피스텔') {
    if (rentalType === '매매') {
      if (price < 5000) {
        maxFees = 25
        fees = price * 0.006
      } else if (price < 20000) {
        maxFees = 80
        fees = price * 0.005
      } else if (price < 90000) {
        maxFees = null
        fees = price * 0.004
      } else if (price < 120000) {
        maxFees = null
        fees = price * 0.005
      } else if (price < 150000) {
        maxFees = null
        fees = price * 0.006
      } else {
        maxFees = null
        fees = price * 0.007
      }
    } else {
      if (price < 5000) {
        maxFees = 20
        fees = price * 0.005
      } else if (price < 10000) {
        maxFees = 30
        fees = price * 0.004
      } else if (price < 60000) {
        maxFees = null
        fees = price * 0.003
      } else if (price < 120000) {
        maxFees = null
        fees = price * 0.004
      } else if (price < 150000) {
        maxFees = null
        fees = price * 0.005
      } else {
        maxFees = null
        fees = price * 0.006
      }
    }
  } else {
    if (rentalType === '매매') {
      fees = price * 0.005
    } else {
      fees = price * 0.004
    }
  }

  let baseFees
  if (maxFees > 0 && fees > maxFees) {
    baseFees = maxFees
  } else {
    baseFees = fees
  }

  return baseFees > 99
    ? { fees: baseFees - 99, isDiscount: true }
    : { fees: baseFees, isDiscount: false }
}
