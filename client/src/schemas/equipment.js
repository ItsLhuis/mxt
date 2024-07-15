import { z } from "zod"

export const equipmentSchema = z.object({
  clientId: z.number({ message: "O cliente é obrigatório" }),
  typeId: z.number({ message: "O tipo é obrigatório" }),
  brandId: z.number({ message: "A marca é obrigatório" }),
  modelId: z.number({ message: "O modelo é obrigatório" }),
  sn: z.string().min(1, { message: "O número de série é obrigatório" }).max(255).trim(),
  description: z.string().optional().nullable()
})

export const updateEquipmentSchema = z.object({
  typeId: z.number({ message: "O tipo é obrigatório" }),
  brandId: z.number({ message: "A marca é obrigatório" }),
  modelId: z.number({ message: "O modelo é obrigatório" }),
  sn: z.string().min(1, { message: "O número de série é obrigatório" }).max(255).trim(),
  description: z.string().optional().nullable()
})

export const updateClientEquipmentSchema = z.object({
  clientId: z.number({ message: "O cliente é obrigatório" })
})

export const equipmentAttachmentSchema = z.object({
  attachments: z
    .array(z.instanceof(File, { message: "Selecione pelo menos um anexo" }))
    .min(1, { message: "Selecione pelo menos um anexo" })
})

export const typeSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255)
})

export const brandSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255)
})

export const modelSchema = z.object({
  brandId: z.number({ message: "A marca é obrigatória" }),
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255)
})
