const { z } = require("zod")

const employeeSchema = z.object({
  name: z.string().max(255),
  phoneNumber: z.string().max(20),
  country: z.string().max(255),
  city: z.string().max(255),
  locality: z.string().max(255),
  address: z.string().max(255),
  postalCode: z
    .string()
    .max(20)
    .regex(/^\d{4}-\d{3}$/),
  description: z.string().optional()
})

module.exports = {
  employeeSchema
}
