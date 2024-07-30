import { z } from "zod"
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "O nome é obrigatório" })
    .max(255, { message: "O nome não pode exceder 255 caracteres" }),
  description: z.string().trim().optional().nullable()
})

export const clientContactSchema = z
  .object({
    type: z.enum(["E-mail", "Telefone", "Telemóvel", "Outro"], {
      message: "O tipo é obrigatório"
    }),
    contact: z
      .string()
      .trim()
      .min(1, { message: "O contacto é obrigatório" })
      .max(255, { message: "O contacto não pode exceder 255 caracteres" }),
    description: z.string().trim().optional().nullable()
  })
  .refine(
    (data) => {
      if (data.type === "E-mail") {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)
      } else if (data.type === "Telefone" || data.type === "Telemóvel") {
        const phoneNumber = parsePhoneNumberFromString(data.contact)
        return (
          phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))
        )
      }
      return true
    },
    { message: "Contacto inválido", path: ["contact"] }
  )

export const clientAddressSchema = z.object({
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
    })
})
