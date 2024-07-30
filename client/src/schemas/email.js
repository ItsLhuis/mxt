import { z } from "zod"

export const emailSchema = z
  .object({
    clientId: z.number({ message: "O cliente é obrigatório" }).int().positive(),
    contactId: z.number({ message: "O contacto é obrigatório" }).int().positive(),
    subject: z
      .string()
      .trim()
      .min(1, { message: "O assunto é obrigatório" })
      .max(255, { message: "O assunto não pode exceder 255 caracteres" }),
    title: z
      .string()
      .trim()
      .min(1, { message: "O título é obrigatório" })
      .max(255, { message: "O título não pode exceder 255 caracteres" }),
    message: z.string().trim().min(1, { message: "A mensagem é obrigatória" }),
    text: z.string().trim().min(1, { message: "O texto é obrigatório" }).optional(),
    attachments: z.array(z.instanceof(File, { message: "Os anexos são inválidos" })).optional()
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
