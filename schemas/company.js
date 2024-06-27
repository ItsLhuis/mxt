const { z } = require("zod")
const { parsePhoneNumberFromString, isPossiblePhoneNumber } = require("libphonenumber-js")

const { POSTAL_CODE_REGEX } = require("@constants/regexes")

const companySchema = z
  .object({
    name: z.string().max(255).trim(),
    address: z.string().max(255).trim(),
    city: z.string().max(255).trim(),
    locality: z.string().max(255).trim(),
    country: z.string().max(255).trim(),
    postalCode: z.string().max(20).regex(POSTAL_CODE_REGEX).trim(),
    phoneNumber: z.string().max(20).trim(),
    email: z.string().email().trim(),
    website: z.string().optional().nullable()
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
