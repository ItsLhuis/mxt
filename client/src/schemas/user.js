import { z } from "zod"
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const authSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "O nome de utilizador é obrigatório" })
    .max(255, { message: "O nome de utilizador não pode exceder 255 caracteres" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "A senha é obrigatória" })
    .max(255, { message: "A senha não pode exceder 255 caracteres" })
})

export const authResetPasswordRequest = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "O e-mail não pode exceder 255 caracteres" })
})

export const authResetPasswordVerify = z.object({
  otp: z
    .string({ required_error: "O código é obrigatório" })
    .min(6, { message: "O código é obrigatório" })
})

export const authResetPasswordConfirm = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
      .max(255, { message: "A nova senha não pode exceder 255 caracteres" }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" })
      .max(255, { message: "A confirmação de senha não pode exceder 255 caracteres" })
  })
  .refine(
    (data) =>
      !data.newPassword || !data.confirmPassword || data.newPassword === data.confirmPassword,
    { message: "As senhas não coincidem", path: ["newPassword"] }
  )

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "O nome de utilizador deve ter pelo menos 3 caracteres" })
    .max(255, { message: "O nome de utilizador não pode exceder 255 caracteres" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
    .max(255, { message: "A senha não pode exceder 255 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "O e-mail não pode exceder 255 caracteres" }),
  role: z.enum(["Chefe", "Administrador", "Funcionário"], { message: "Cargo inválido" }),
  isActive: z.boolean({ message: "Valor inválido" })
})

export const updateUserPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(6, { message: "A senha atual deve ter pelo menos 6 caracteres" })
      .max(255, { message: "A senha atual não pode exceder 255 caracteres" }),
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" })
      .max(255, { message: "A nova senha não pode exceder 255 caracteres" }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" })
      .max(255, { message: "A confirmação de senha não pode exceder 255 caracteres" })
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
    .min(3, { message: "O nome de utilizador deve ter pelo menos 3 caracteres" })
    .max(255, { message: "O nome de utilizador não pode exceder 255 caracteres" }),
  email: z.string().trim().email({ message: "E-mail inválido" })
})

export const updateUserPersonalDataSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "O nome é obrigatório" })
      .max(255, { message: "O nome não pode exceder 255 caracteres" }),
    phoneNumber: z
      .string()
      .trim()
      .min(1, { message: "O contacto é obrigatório" })
      .max(20, { message: "O contacto não pode exceder 20 caracteres" }),
    country: z
      .string()
      .trim()
      .min(1, { message: "O país é obrigatório" })
      .max(255, { message: "O país não pode exceder 255 caracteres" }),
    city: z
      .string()
      .trim()
      .min(1, { message: "A cidade é obrigatória" })
      .max(255, { message: "A cidade não pode exceder 255 caracteres" }),
    locality: z
      .string()
      .trim()
      .min(1, { message: "A localidade é obrigatória" })
      .max(255, { message: "A localidade não pode exceder 255 caracteres" }),
    address: z
      .string()
      .trim()
      .min(1, { message: "A morada é obrigatória" })
      .max(255, { message: "A morada não pode exceder 255 caracteres" }),
    postalCode: z
      .string()
      .trim()
      .max(20, { message: "O código postal não pode exceder 20 caracteres" })
      .regex(/^[a-zA-Z0-9](?:[-\s]?[a-zA-Z0-9]){0,9}[a-zA-Z0-9]$/, {
        message: "Código postal inválido"
      })
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
