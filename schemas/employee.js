const { z } = require("zod")
const { parsePhoneNumberFromString, isPossiblePhoneNumber } = require("libphonenumber-js")

const { POSTAL_CODE_REGEX } = require("@constants/regexes")

const employeeSchema = z
  .object({
    name: z.string().min(1).max(255).trim(),
    phoneNumber: z.string().min(1).max(20).trim(),
    country: z.string().min(1).max(255).trim(),
    city: z.string().min(1).max(255).trim(),
    locality: z.string().min(1).max(255).trim(),
    address: z.string().min(1).max(255).trim(),
    postalCode: z.string().min(1).max(20).regex(POSTAL_CODE_REGEX).trim(),
    description: z.string().optional().nullable()
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
  employeeSchema
}
