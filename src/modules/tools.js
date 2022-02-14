export function setPriceUnit(value) {
  const trillion = Math.floor(value / 100000000)
  let remainder = value % 100000000
  const hundredMillion = Math.floor(remainder / 10000)
  remainder = remainder % 10000

  return `${trillion ? trillion + '조' : ''} ${
    hundredMillion ? hundredMillion + '억' : ''
  } ${remainder ? remainder + '만원' : ''}`
}

export function amount(transactionInfo) {
  const type = transactionInfo.type
  switch (type) {
    case '전세':
      return setPriceUnit(transactionInfo.rentalCost)
    case '월세':
      return `${setPriceUnit(transactionInfo.deposit)} / ${setPriceUnit(
        transactionInfo.monthlyRentCost
      )}`
    case '매매':
      return setPriceUnit(transactionInfo.salePrice)
    default:
      return ''
  }
}

export function rangeArray(end, start = 1) {
  const array = []
  for (let i = start; i <= end; i++) {
    array.push(i)
  }
  return array
}

export function removeUndefined(value) {
  const object = { ...value }
  const entries = Object.entries(object)

  entries.forEach((entry) => {
    if (typeof entry[1] === 'object') {
      entry[1] = removeUndefined(entry[1])
    }
    if (entry[1] === undefined || entry[1] === null || entry[1] === '') {
      delete object[entry[0]]
    }
  })

  if (Object.entries(object).length === 0) {
    return undefined
  }

  return object
}
