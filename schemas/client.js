const { z } = require("zod")
const { parsePhoneNumberFromString, isPossiblePhoneNumber } = require("libphonenumber-js")

const { EMAIL_REGEX, POSTAL_CODE_REGEX } = require("@constants/regexes")

const clientSchema = z.object({
  name: z.string().max(255).trim(),
  description: z.string().optional().nullable()
})

const clientContactSchema = z
  .object({
    type: z.enum(["E-mail", "Telefone", "Telemóvel", "Outro"]),
    contact: z.string().max(255).trim(),
    description: z.string().optional().nullable()
  })
  .refine(
    (data) => {
      if (data.type === "E-mail") {
        return EMAIL_REGEX.test(data.contact)
      } else if (data.type === "Telefone" || data.type === "Telemóvel") {
        const phoneNumber = parsePhoneNumberFromString(data.contact)
        return (
          phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))
        )
      }
      return true
    },
    { message: "Invalid contact format", path: ["contact"] }
  )

const clientAddressSchema = z.object({
  country: z.string().max(255).trim(),
  city: z.string().max(255).trim(),
  locality: z.string().max(255).trim(),
  address: z.string().max(255).trim(),
  postalCode: z.string().max(20).regex(POSTAL_CODE_REGEX).trim()
})

module.exports = {
  clientSchema,
  clientContactSchema,
  clientAddressSchema
}
