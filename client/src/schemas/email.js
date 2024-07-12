import { z } from "zod"

export const emailSchema = z
  .object({
    clientId: z.number().int().positive(),
    contactId: z.number().int().positive(),
    subject: z.string().min(1).max(255).trim(),
    title: z.string().min(1).max(255).trim(),
    message: z.string().min(1).trim(),
    text: z.string().min(1).trim().optional(),
    attachments: z.array(z.instanceof(File)).optional()
  })
  .refine(
    (data) => {
      if (!data.attachments) return true
      const totalSize = data.attachments.reduce((sum, file) => sum + file.size, 0)
      return totalSize <= 40 * 1024 * 1024
    },
    {
      message: "O tamanho total de todos os anexos deve ser de 40 MB ou menos",
      path: ["attachments"]
    }
  )
