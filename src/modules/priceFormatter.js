const insertComma = (numValue) => {
  const oldData = String(extractNumber(numValue))
  const newData = oldData.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",")
  return newData
}
const extractNumber = (numValue) => {
  const newData = String(numValue).replaceAll(/[^(0-9)]/gi, "");
  return Number(newData) || 0
}

export {
  insertComma,
  extractNumber
}