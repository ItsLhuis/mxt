import { z } from "zod"
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const initialCompanySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "O nome é obrigatório" })
      .max(255, { message: "O nome não pode exceder 255 caracteres" }),
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
      .min(1, { message: "O código postal é obrigatório" })
      .max(20, { message: "O código postal não pode exceder 20 caracteres" })
      .regex(/^[a-zA-Z0-9](?:[-\s]?[a-zA-Z0-9]){0,9}[a-zA-Z0-9]$/, {
        message: "Código postal inválido"
      }),
    phoneNumber: z
      .string()
      .trim()
      .min(1, { message: "O contacto é obrigatório" })
      .max(20, { message: "O contacto não pode exceder 20 caracteres" }),
    email: z.string().trim().email({ message: "E-mail inválido" }),
    website: z.string().optional().nullable(),
    logo: z.instanceof(File, { message: "Selecione o logotipo da empresa" })
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

export const companySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "O nome é obrigatório" })
      .max(255, { message: "O nome não pode exceder 255 caracteres" }),
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
      .min(1, { message: "O código postal é obrigatório" })
      .max(20, { message: "O código postal não pode exceder 20 caracteres" })
      .regex(/^[a-zA-Z0-9](?:[-\s]?[a-zA-Z0-9]){0,9}[a-zA-Z0-9]$/, {
        message: "Código postal inválido"
      }),
    phoneNumber: z
      .string()
      .trim()
      .min(1, { message: "O contacto é obrigatório" })
      .max(20, { message: "O contacto não pode exceder 20 caracteres" }),
    email: z.string().trim().email({ message: "E-mail inválido" }),
    website: z.string().optional().nullable()
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

export const companyLogoSchema = z.object({
  logo: z.instanceof(File, { message: "Selecione o logotipo da empresa" })
})
