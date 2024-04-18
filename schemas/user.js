const { z } = require("zod")

const authSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255)
})

const createUserSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
  email: z.string().email().max(255),
  role: z.enum(["Chefe", "Administrador", "Funcionário"]),
  isActive: z.boolean().optional()
})

const updateUserSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
  email: z.string().email().max(255)
})

module.exports = {
  authSchema,
  createUserSchema,
  updateUserSchema
}
