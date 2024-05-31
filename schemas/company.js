const { z } = require("zod")
const { parsePhoneNumberFromString, isPossiblePhoneNumber } = require("libphonenumber-js")

const { POSTAL_CODE_REGEX } = require("@constants/regexes")

const companySchema = z
  .object({
    name: z.string().max(255),
    address: z.string().max(255),
    city: z.string().max(255),
    country: z.string().max(255),
    postalCode: z.string().max(20).regex(POSTAL_CODE_REGEX),
    phoneNumber: z.string().max(20),
    email: z.string().email()
  })
  .refine(
    (data) => {
      if (data.phoneNumber) {
        const phoneNumber = parsePhoneNumberFromString(data.phoneNumber)
        return (
          phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))
        )
      }
      return true
    },
    { message: "Invalid phone number format", path: ["phoneNumber"] }
  )

module.exports = {
  companySchema
}
