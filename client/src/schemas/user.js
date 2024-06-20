import { z } from "zod"

export const authSchema = z.object({
  username: z.string().trim().min(1, { message: "O nome de utilizador é obrigatório" }).max(255),
  password: z.string().trim().min(1, { message: "A senha é obrigatória" }).max(255)
})
