export const formatNumber = (number) => {
  const parts = parseFloat(number).toFixed(2).split(".")
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  const decimalPart = parts[1] && parts[1] !== "00" ? "," + parts[1] : ""
  return integerPart + decimalPart
}
