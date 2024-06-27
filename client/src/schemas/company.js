import { z } from "zod"
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from "libphonenumber-js"

export const companySchema = z
  .object({
    name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255),
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
    phoneNumber: z
      .string({ required_error: "O contacto é obrigatório" })
      .trim()
      .min(1, { message: "O contacto é obrigatório" })
      .max(20),
    email: z.string().email({ message: "E-mail inválido" }).trim(),
    website: z.string().optional().nullable(),
    logo: z.instanceof(File)
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
