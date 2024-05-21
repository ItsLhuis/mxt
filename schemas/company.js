const { z } = require("zod")

const companySchema = z.object({
  name: z.string().max(255),
  address: z.string().max(255),
  city: z.string().max(255),
  country: z.string().max(255),
  postalCode: z
    .string()
    .max(20)
    .regex(/^\d{4}-\d{3}$/),
  phoneNumber: z.string().max(20),
  email: z.string().email()
})

module.exports = {
  companySchema
}
