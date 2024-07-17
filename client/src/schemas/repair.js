import { z } from "zod"

export const repairSchema = z.object({
  equipmentId: z.number({ message: "O equipamento é obrigatório" }),
  statusId: z.number({ message: "O estado é obrigatório" }),
  entryDescription: z.string().optional().nullable(),
  entryDatetime: z.date({
    message: "A data de entrada é obrigatória",
    errorMap: () => ({
      message: "A data de entrada é obrigatória"
    })
  })
})

export const updateRepairSchema = z.object({
  statusId: z.number(),
  entryAccessoriesDescription: z.string().optional().nullable(),
  entryReportedIssuesDescription: z.string().optional().nullable(),
  entryDescription: z.string().optional().nullable(),
  entryDatetime: z.date().optional(),
  interventionWorksDoneDescription: z.string().optional().nullable(),
  interventionAccessoriesUsedDescription: z.string().optional().nullable(),
  interventionDescription: z.string().optional().nullable(),
  conclusionDatetime: z.date().optional().nullable(),
  deliveryDatetime: z.date().optional().nullable(),
  isClientNotified: z.boolean(),
  entryAccessoriesIds: z.array(z.number()).optional().nullable(),
  entryReportedIssuesIds: z.array(z.number()).optional().nullable(),
  interventionWorksDoneIds: z.array(z.number()).optional().nullable(),
  interventionAccessoriesUsedIds: z.array(z.number()).optional().nullable()
})

export const optionsSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }).max(255).trim()
})

export const repairStatusSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }).max(255),
  color: z.enum(["default", "primary", "error", "info", "success", "warning"], {
    message: "Cor inválida"
  })
})
