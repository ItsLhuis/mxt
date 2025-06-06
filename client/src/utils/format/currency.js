export const formatValueToEuro = (value) => {
  const euros = parseFloat(value).toFixed(2).replace(".", ",")
  const eurosWithSpaces = euros.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return eurosWithSpaces.endsWith(",00")
    ? eurosWithSpaces.slice(0, -3) + " €"
    : eurosWithSpaces + " €"
}
