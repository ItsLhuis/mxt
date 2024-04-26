const { z } = require("zod")

const clientSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional()
})

const clientContactSchema = z.object({
  contactType: z.enum(["E-mail", "Telefone", "Telemóvel", "Outro"]),
  contact: z.string().max(255),
  description: z.string().optional()
})

const clientAddressSchema = z.object({
  country: z.string().max(255),
  city: z.string().max(255),
  locality: z.string().max(255),
  address: z.string().max(255),
  postalCode: z
    .string()
    .max(20)
    .regex(/^\d{4}-\d{3}$/)
})

module.exports = {
  clientSchema,
  clientContactSchema,
  clientAddressSchema
}
