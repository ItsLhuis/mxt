const { parsePhoneNumberFromString, isPossiblePhoneNumber } = require("libphonenumber-js")

const formatPhoneNumber = (value) => {
  if (typeof value !== "string") {
    return value
  }

  const phoneNumber = parsePhoneNumberFromString(value)

  if (phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))) {
    return phoneNumber.formatInternational()
  }

  return value
}

module.exports = formatPhoneNumber