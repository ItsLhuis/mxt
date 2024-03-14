export const formatPhoneNumber = (value) => {
  const phoneNumberRegex = /^\d{9}$/
  if (!phoneNumberRegex.test(value)) {
    return value
  }

  const formattedPhoneNumber = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`

  return formattedPhoneNumber
}
