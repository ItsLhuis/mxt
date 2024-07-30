import { z } from "zod"

export const smsSchema = z.object({
  clientId: z.number({ message: "O para é obrigatório" }).int().positive(),
  contactId: z.number({ message: "O para é obrigatório" }).int().positive(),
  message: z.string().trim().min(1, { message: "A mensagem é obrigatória" })
})
