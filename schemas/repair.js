const { z } = require("zod")

const repairSchema = z.object({
  equipmentId: z.number(),
  statusId: z.number(),
  entryDescription: z.string().optional().nullable(),
  entryDatetime: z.coerce.date()
})

const updateRepairSchema = z.object({
  statusId: z.number(),
  entryAccessoriesDescription: z.string().optional().nullable(),
  entryReportedIssuesDescription: z.string().optional().nullable(),
  entryDescription: z.string().optional().nullable(),
  entryDatetime: z.coerce.date(),
  interventionWorksDoneDescription: z.string().optional().nullable(),
  interventionAccessoriesUsedDescription: z.string().optional().nullable(),
  interventionDescription: z.string().optional().nullable(),
  conclusionDatetime: z.coerce.date().optional().nullable(),
  deliveryDatetime: z.coerce.date().optional().nullable(),
  isClientNotified: z.boolean(),
  entryAccessoriesIds: z.array(z.number()).optional().nullable(),
  entryReportedIssuesIds: z.array(z.number()).optional().nullable(),
  interventionWorksDoneIds: z.array(z.number()).optional().nullable(),
  interventionAccessoriesUsedIds: z.array(z.number()).optional().nullable()
})

const optionsSchema = z.object({
  name: z.string().min(1).max(255).trim()
})

const repairStatusSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  color: z.enum(["default", "primary", "error", "info", "success", "warning"])
})

module.exports = {
  repairSchema,
  updateRepairSchema,
  optionsSchema,
  repairStatusSchema
}
