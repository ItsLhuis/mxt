export const formatValueToPercentage = (value) => {
  const parsedValue = parseFloat(value)
  const formattedPercentage =
    parsedValue % 1 !== 0 ? parsedValue.toFixed(2) : parsedValue.toFixed(0)
  return formattedPercentage + " %"
}
