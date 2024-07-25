export const formatValueToPercentage = (value) => {
  if (value === 0) return "0,00 %"
  
  const parsedValue = parseFloat(value)
  const formattedValue =
    parsedValue % 1 !== 0 ? parsedValue.toFixed(2).replace(".", ",") : parsedValue.toFixed(0)
  return formattedValue + " %"
}
