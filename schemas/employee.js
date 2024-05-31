const { z } = require("zod")

const { POSTAL_CODE_REGEX } = require("@constants/regexes")

const employeeSchema = z.object({
  name: z.string().max(255),
  phoneNumber: z.string().max(20),
  country: z.string().max(255),
  city: z.string().max(255),
  locality: z.string().max(255),
  address: z.string().max(255),
  postalCode: z.string().max(20).regex(POSTAL_CODE_REGEX),
  description: z.string().optional().nullable()
})

module.exports = {
  employeeSchema
}
