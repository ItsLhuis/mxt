const { z } = require("zod")

const equipmentSchema = z.object({
  clientId: z.number(),
  brandId: z.number(),
  modelId: z.number(),
  typeId: z.number(),
  sn: z.string().min(1).max(255).trim(),
  description: z.string().optional().nullable()
})

const updateEquipmentSchema = z.object({
  brandId: z.number(),
  modelId: z.number(),
  typeId: z.number(),
  sn: z.string().min(1).max(255).trim(),
  description: z.string().optional().nullable()
})

const updateClientEquipmentSchema = z.object({
  clientId: z.number()
})

const typeSchema = z.object({
  name: z.string().min(1).max(255).trim()
})

const brandSchema = z.object({
  name: z.string().min(1).max(255).trim()
})

const modelSchema = z.object({
  brandId: z.number(),
  name: z.string().min(1).max(255).trim()
})

module.exports = {
  equipmentSchema,
  updateEquipmentSchema,
  updateClientEquipmentSchema,
  typeSchema,
  brandSchema,
  modelSchema
}
