import { z } from "zod"
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const authSchema = z.object({
  username: z.string().trim().min(1, { message: "O nome de utilizador é obrigatório" }).max(255),
  password: z.string().trim().min(1, { message: "A senha é obrigatória" }).max(255)
})

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O nome de utilizador deve ter pelo menos 3 caracteres" })
    .max(255)
    .trim(),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
    .max(255)
    .trim(),
  email: z.string().email({ message: "E-mail inválido" }).max(255).trim(),
  role: z.enum(["Chefe", "Administrador", "Funcionário"], { message: "Cargo inválido" }),
  isActive: z.boolean({ message: "Valor inválido" })
})

export const updateUserPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "A senha atual deve ter pelo menos 6 caracteres" })
      .max(255)
      .trim(),
    newPassword: z
      .string()
      .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" })
      .max(255)
      .trim(),
    confirmPassword: z
      .string()
      .min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" })
      .max(255)
      .trim()
  })
  .refine(
    (data) =>
      !data.newPassword || !data.confirmPassword || data.newPassword === data.confirmPassword,
    { message: "As senhas não coincidem", path: ["newPassword"] }
  )

export const updateUserRoleSchema = z.object({
  role: z.enum(["Chefe", "Administrador", "Funcionário"], { message: "Cargo inválido" })
})

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({ message: "Valor inválido" })
})

export const updateUserAvatarSchema = z.object({
  avatar: z.instanceof(File, { message: "Selecione uma imagem" })
})

export const updateUserAccountSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "O nome de utilizador deve ter pelo menos 3 caracteresdis" })
    .max(255),
  email: z.string().email({ message: "E-mail inválido" }).trim()
})

export const updateUserPersonalDataSchema = z
  .object({
    name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255),
    phoneNumber: z
      .string({ required_error: "O contacto é obrigatório" })
      .trim()
      .min(1, { message: "O contacto é obrigatório" })
      .max(20),
    country: z.string().trim().min(1, { message: "O país é obrigatório" }).max(255),
    city: z.string().trim().min(1, { message: "A cidade é obrigatória" }).max(255),
    locality: z.string().trim().min(1, { message: "A localidade é obrigatória" }).max(255),
    address: z.string().trim().min(1, { message: "A morada é obrigatória" }).max(255),
    postalCode: z
      .string()
      .max(20)
      .regex(/^[a-zA-Z0-9](?:[-\s]?[a-zA-Z0-9]){0,9}[a-zA-Z0-9]$/, {
        message: "Código postal inválido"
      })
      .trim()
      .min(1, { message: "O código postal é obrigatório" }),
    description: z.string().optional().nullable()
  })
  .refine(
    (data) => {
      if (data.phoneNumber) {
        const phoneNumber = parsePhoneNumberFromString(data.phoneNumber)
        return (
          phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))
        )
      }
      return true
    },
    { message: "Contacto inválido", path: ["phoneNumber"] }
  )
