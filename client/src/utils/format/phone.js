import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const formatPhoneNumber = (value) => {
  if (typeof value !== "string") {
    return value
  }

  const phoneNumber = parsePhoneNumberFromString(value)

  if (phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))) {
    return phoneNumber.formatInternational()
  }

  return value
}
