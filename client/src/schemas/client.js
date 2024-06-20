import { z } from "zod"
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const clientSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255),
  description: z.string().optional().nullable()
})

export const clientContactSchema = z
  .object({
    type: z.enum(["E-mail", "Telefone", "Telemóvel", "Outro"], {
      message: "O tipo é obrigatório"
    }),
    contact: z.string().trim().min(1, { message: "O contacto é obrigatório" }).max(255),
    description: z.string().optional().nullable()
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
    { message: "Invalid contact format", path: ["contact"] }
  )

export const clientAddressSchema = z.object({
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
    .min(1, { message: "O código postal é obrigatório" })
})

/* export const addClientSchema = z
  .object({
    name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255),
    clientDescription: z.string().optional().nullable(),
    contactType: z.enum(["E-mail", "Telefone", "Telemóvel", "Outro"], {
      message: "O tipo é obrigatório"
    }),
    contact: z.string().trim().min(1, { message: "O contacto é obrigatório" }).max(255),
    contactDescription: z.string().optional().nullable(),
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
      .min(1, { message: "O código postal é obrigatório" })
  })
  .refine(
    (data) => {
      if (data.contactType === "E-mail") {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)
      } else if (data.contactType === "Telefone" || data.contactType === "Telemóvel") {
        const phoneNumber = parsePhoneNumberFromString(data.contact)
        return (
          phoneNumber && phoneNumber.isValid() && isPossiblePhoneNumber(String(phoneNumber.number))
        )
      }
      return true
    },
    { message: "Contacto inválido", path: ["contact"] }
  ) */
