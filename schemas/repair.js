const { z } = require("zod")

const repairSchema = z.object({
  equipmentId: z.number(),
  statusId: z.number(),
  clientOsPassword: z.string().max(255).optional().nullable(),
  clientBiosPassword: z.string().max(255).optional().nullable(),
  entryDescription: z.string().optional().nullable(),
  entryDatetime: z.date()
})

const updateRepairSchema = z.object({
  statusId: z.number(),
  clientOsPassword: z.string().max(255).optional().nullable(),
  clientBiosPassword: z.string().max(255).optional().nullable(),
  entryAccessoriesDescription: z.string().optional().nullable(),
  entryReportedIssuesDescription: z.string().optional().nullable(),
  entryDescription: z.string().optional().nullable(),
  entryDatetime: z.date().optional(),
  interventionWorksDoneDescription: z.string().optional().nullable(),
  interventionAccessoriesUsedDescription: z.string().optional().nullable(),
  interventionDescription: z.string().optional().nullable(),
  conclusionDatetime: z.date().optional().nullable(),
  deliveryDatetime: z.date().optional().nullable(),
  entryAccessoriesIds: z.array(z.number()).optional().nullable(),
  entryReportedIssuesIds: z.array(z.number()).optional().nullable(),
  interventionWorksDoneIds: z.array(z.number()).optional().nullable(),
  interventionAccessoriesUsedIds: z.array(z.number()).optional().nullable()
})

module.exports = {
  repairSchema,
  updateRepairSchema
}
