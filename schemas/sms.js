const { z } = require("zod")

const smsSchema = z.object({
  clientId: z.number().int().positive(),
  contactId: z.number().int().positive(),
  message: z.string().min(1).trim()
})

module.exports = {
  smsSchema
}
