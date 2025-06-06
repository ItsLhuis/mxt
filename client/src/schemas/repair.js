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

export const updateRepairSchema = z
  .object({
    statusId: z.number({ message: "O estado é obrigatório" }),
    entryAccessoriesDescription: z.string().optional().nullable(),
    entryReportedIssuesDescription: z.string().optional().nullable(),
    entryDescription: z.string().optional().nullable(),
    entryDatetime: z.date({
      message: "A data de entrada é obrigatória",
      errorMap: () => ({
        message: "A data de entrada é obrigatória"
      })
    }),
    interventionWorksDoneDescription: z.string().optional().nullable(),
    interventionAccessoriesUsedDescription: z.string().optional().nullable(),
    interventionDescription: z.string().optional().nullable(),
    conclusionDatetime: z
      .date({
        message: "Data inválida",
        errorMap: () => ({
          message: "Data inválida"
        })
      })
      .optional()
      .nullable(),
    deliveryDatetime: z
      .date({
        message: "Data inválida",
        errorMap: () => ({
          message: "Data inválida"
        })
      })
      .optional()
      .nullable(),
    isClientNotified: z.boolean({ message: "Valor inválido" }),
    entryAccessories: z.array(z.number()).optional().nullable(),
    entryReportedIssues: z.array(z.number()).optional().nullable(),
    interventionWorksDone: z.array(z.number()).optional().nullable(),
    interventionAccessoriesUsed: z.array(z.number()).optional().nullable()
  })
  .refine(
    (data) => {
      if (data.conclusionDatetime && data.entryDatetime) {
        return data.conclusionDatetime >= data.entryDatetime
      }
      return true
    },
    {
      path: ["conclusionDatetime"],
      message: "A data selecionada está antes do limite mínimo"
    }
  )
  .refine(
    (data) => {
      if (data.deliveryDatetime && data.conclusionDatetime) {
        return data.deliveryDatetime >= data.conclusionDatetime
      }
      return true
    },
    {
      path: ["deliveryDatetime"],
      message: "A data selecionada está antes do limite mínimo"
    }
  )

export const repairAttachmentSchema = z.object({
  attachments: z
    .array(z.instanceof(File, { message: "Selecione pelo menos um anexo" }))
    .min(1, { message: "Selecione pelo menos um anexo" })
})

export const optionsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "O nome é obrigatório" })
    .max(255, { message: "O nome não pode exceder 255 caracteres" })
})

export const repairStatusSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "O nome é obrigatório" })
    .max(255, { message: "O nome não pode exceder 255 caracteres" }),
  color: z.enum(["default", "primary", "error", "info", "success", "warning"], {
    message: "Cor inválida"
  })
})
