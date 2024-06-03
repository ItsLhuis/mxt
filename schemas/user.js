const { z } = require("zod")

const authSchema = z.object({
  username: z.string().min(3).max(255).trim(),
  password: z.string().min(6).max(255).trim()
})

const createUserSchema = z.object({
  username: z.string().min(3).max(255).trim(),
  password: z.string().min(6).max(255).trim(),
  email: z.string().email().max(255).trim(),
  role: z.enum(["Chefe", "Administrador", "Funcionário"]),
  isActive: z.boolean().optional().nullable()
})

const updateUserSchema = z.object({
  username: z.string().min(3).max(255).trim(),
  email: z.string().email().max(255).trim(),
  role: z.enum(["Chefe", "Administrador", "Funcionário"]).optional().nullable(),
  isActive: z.boolean().optional().nullable()
})

const updateUserPasswordSchema = z
  .object({
    password: z.string().min(6).max(255).trim(),
    newPassword: z.string().min(6).max(255).trim(),
    confirmPassword: z.string().min(6).max(255).trim()
  })
  .refine(
    (data) =>
      !data.newPassword || !data.confirmPassword || data.newPassword === data.confirmPassword,
    { message: "New password and confirmation password do not match", path: ["newPassword"] }
  )

const resetPassword = {
  requestSchema: z.object({
    email: z.string().email().max(255).trim()
  }),
  verifySchema: z.object({
    otp: z.string().length(6).trim()
  }),
  confirmSchema: z
    .object({
      newPassword: z.string().min(6).max(255).trim(),
      confirmPassword: z.string().min(6).max(255).trim()
    })
    .refine(
      (data) =>
        !data.newPassword || !data.confirmPassword || data.newPassword === data.confirmPassword,
      { message: "New password and confirmation password do not match", path: ["newPassword"] }
    )
}

module.exports = {
  authSchema,
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  resetPassword
}
