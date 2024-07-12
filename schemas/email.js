const { z } = require("zod")

const emailSchema = z.object({
  clientId: z.number().int().positive(),
  contactId: z.number().int().positive(),
  subject: z.string().min(1).max(255).trim(),
  title: z.string().min(1).max(255).trim(),
  message: z.string().min(1).trim(),
  text: z.string().min(1).trim().optional().nullable()
})

module.exports = {
  emailSchema
}
