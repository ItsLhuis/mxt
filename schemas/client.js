const { z } = require("zod")

const clientSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable()
})

const clientContactSchema = z
  .object({
    type: z.enum(["E-mail", "Telefone", "Telemóvel", "Outro"]),
    contact: z.string().max(255),
    description: z.string().optional().nullable()
  })
  .refine(
    (data) => {
      if (data.type === "E-mail") {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)
      }
      return true
    },
    { message: "Invalid contact format for E-mail contact type", path: ["contact"] }
  )

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
