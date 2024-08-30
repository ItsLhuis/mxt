const { PassThrough } = require("stream")

const { produce } = require("immer")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const processImage = require("@utils/processImage")

const {
  EQUIPMENT_NOT_FOUND,
  BRAND_NOT_FOUND,
  MODEL_NOT_FOUND,
  TYPE_NOT_FOUND,
  DUPLICATE_BRAND_NAME,
  DUPLICATE_MODEL_NAME,
  DUPLICATE_TYPE_NAME,
  DUPLICATE_SN,
  MODEL_NOT_MATCH_BRAND,
  EQUIPMENTS_ASSOCIATED_WITH_BRAND,
  EQUIPMENTS_ASSOCIATED_WITH_MODEL,
  EQUIPMENTS_ASSOCIATED_WITH_TYPE,
  NO_FILES_UPLOADED,
  ATTACHMENT_NOT_FOUND
} = require("@constants/errors/equipment")
const { CLIENT_NOT_FOUND } = require("@constants/errors/client")
const { ATTACHMENT_STREAMING_ERROR } = require("@constants/errors/shared/attachment")
const { ACTIVITY_YEAR_NOT_PROVIDED } = require("@constants/errors/shared/analytics")

const { ATTACHMENT_ERROR_TYPE } = require("@constants/errors/shared/types")

const {
  EQUIPMENT_CREATED,
  EQUIPMENT_UPDATED,
  EQUIPMENT_ATTACHMENT_CREATED,
  EQUIPMENT_ATTACHMENT_DELETED
} = require("@constants/interactions/equipment")

const roles = require("@constants/roles")

const Equipment = require("@models/equipment")
const {
  equipmentSchema,
  updateEquipmentSchema,
  updateClientEquipmentSchema,
  typeSchema,
  brandSchema,
  modelSchema
} = require("@schemas/equipment")

const Client = require("@models/client")

const { upload } = require("@middlewares/uploadFileHandler")

const equipmentController = {
  findAll: tryCatch(async (req, res) => {
    const equipments = await Equipment.findAll()

    const includeInteractionsHistory = req.user.role !== roles.EMPLOYEE

    const filteredEquipments = produce(equipments, (draft) => {
      if (!includeInteractionsHistory) {
        draft.forEach((equipment) => {
          delete equipment.interactions_history
        })
      }
    })

    res.status(200).json(filteredEquipments)
  }),
  findByEquipmentId: tryCatch(async (req, res) => {
    const { equipmentId } = req.params

    const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
    if (existingEquipment.length <= 0) {
      throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
    }

    const includeInteractionsHistory = req.user.role !== roles.EMPLOYEE

    const filteredEquipment = produce(existingEquipment[0], (draft) => {
      if (!includeInteractionsHistory) {
        delete draft.interactions_history
      }
    })

    res.status(200).json([filteredEquipment])
  }),
  analytics: {
    summary: tryCatch(async (req, res) => {
      const total = await Equipment.analytics.getTotal()
      const lastMonthsTotal = await Equipment.analytics.getLastTwoCompleteMonthsTotal()
      const lastMonthsPercentageChange =
        await Equipment.analytics.getLastTwoCompleteMonthsPercentageChange()

      res.status(200).json({
        total: total[0]["total"],
        last_months_total: lastMonthsTotal,
        percentage_change_last_two_months: lastMonthsPercentageChange
      })
    }),
    activity: tryCatch(async (req, res) => {
      let { year } = req.params

      if (!year) {
        throw new AppError(400, ACTIVITY_YEAR_NOT_PROVIDED, "Year is required", true)
      }

      year = Number(year)

      if (
        isNaN(year) ||
        year.toString().length !== 4 ||
        year < 1900 ||
        year > new Date().getFullYear()
      ) {
        throw new AppError(400, ACTIVITY_YEAR_NOT_PROVIDED, "Invalid year provided", true)
      }

      const totalsByMonthForYear = await Equipment.analytics.getTotalsByMonthForYear(year)
      const totalForYear = totalsByMonthForYear.reduce((acc, monthData) => acc + monthData.total, 0)

      res.status(200).json({
        year: year,
        total_for_year: totalForYear,
        totals_by_month_for_year: totalsByMonthForYear
      })
    })
  },
  create: tryCatch(async (req, res) => {
    const { clientId, brandId, modelId, typeId, sn, description } = req.body

    equipmentSchema.parse(req.body)

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const existingBrand = await Equipment.brand.findByBrandId(brandId)
    if (existingBrand.length <= 0) {
      throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
    }

    const existingModel = await Equipment.model.findByModelId(modelId)
    if (existingModel.length <= 0) {
      throw new AppError(404, MODEL_NOT_FOUND, "Model not found", true)
    }

    const modelsByBrand = await Equipment.model.findByBrandId(brandId)
    const isModelFromBrand = modelsByBrand.some((model) => model.id === modelId)
    if (!isModelFromBrand) {
      throw new AppError(400, MODEL_NOT_MATCH_BRAND, "Model does not match the brand", true)
    }

    const existingType = await Equipment.type.findByTypeId(typeId)
    if (existingType.length <= 0) {
      throw new AppError(404, TYPE_NOT_FOUND, "Type not found", true)
    }

    const existingSn = await Equipment.findBySn(sn)
    if (existingSn.length > 0) {
      throw new AppError(400, DUPLICATE_SN, "Serial number already exists", true)
    }

    const newEquipment = await Equipment.create(
      clientId,
      brandId,
      modelId,
      typeId,
      sn,
      description,
      req.user.id
    )

    const changes = [
      {
        field: "Cliente",
        after: {
          id: existingClient[0].id,
          name: existingClient[0].name,
          description: existingClient[0].description
        }
      },
      { field: "Tipo", after: { id: existingType[0].id, name: existingType[0].name } },
      { field: "Marca", after: { id: existingBrand[0].id, name: existingBrand[0].name } },
      { field: "Modelo", after: { id: existingModel[0].id, name: existingModel[0].name } },
      { field: "SN", after: sn },
      { field: "Descrição", after: !description ? null : description }
    ]

    await createInteractionHistory(newEquipment.insertId, EQUIPMENT_CREATED, changes, req.user.id)
    res.status(201).json({ message: "Equipment created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { equipmentId } = req.params
    const { brandId, modelId, typeId, sn, description } = req.body

    updateEquipmentSchema.parse(req.body)

    const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
    if (existingEquipment.length <= 0) {
      throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
    }

    const existingBrand = await Equipment.brand.findByBrandId(brandId)
    if (existingBrand.length <= 0) {
      throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
    }

    const existingModel = await Equipment.model.findByModelId(modelId)
    if (existingModel.length <= 0) {
      throw new AppError(404, MODEL_NOT_FOUND, "Model not found", true)
    }

    const existingType = await Equipment.type.findByTypeId(typeId)
    if (existingType.length <= 0) {
      throw new AppError(404, TYPE_NOT_FOUND, "Type not found", true)
    }

    const modelsByBrand = await Equipment.model.findByBrandId(brandId)
    const isModelFromBrand = modelsByBrand.some((model) => model.id === modelId)
    if (!isModelFromBrand) {
      throw new AppError(400, MODEL_NOT_MATCH_BRAND, "Model does not match the brand", true)
    }

    const existingSn = await Equipment.findBySn(sn, existingEquipment[0].id)
    if (existingSn.length > 0) {
      throw new AppError(400, DUPLICATE_SN, "Serial number already exists", true)
    }

    await Equipment.update(equipmentId, brandId, modelId, typeId, sn, description, req.user.id)

    const changes = [
      {
        field: "Tipo",
        before: { id: existingEquipment[0].type.id, name: existingEquipment[0].type.name },
        after: { id: existingType[0].id, name: existingType[0].name },
        changed: existingEquipment[0].type.id !== Number(typeId)
      },
      {
        field: "Marca",
        before: { id: existingEquipment[0].brand.id, name: existingEquipment[0].brand.name },
        after: { id: existingBrand[0].id, name: existingBrand[0].name },
        changed: existingEquipment[0].brand.id !== Number(brandId)
      },
      {
        field: "Modelo",
        before: { id: existingEquipment[0].model.id, name: existingEquipment[0].model.name },
        after: { id: existingModel[0].id, name: existingModel[0].name },
        changed: existingEquipment[0].model.id !== Number(modelId)
      },
      {
        field: "SN",
        before: existingEquipment[0].sn,
        after: sn,
        changed: existingEquipment[0].sn !== sn
      },
      {
        field: "Descrição",
        before: existingEquipment[0].description,
        after: !description ? null : description,
        changed: existingEquipment[0].description !== (!description ? null : description)
      }
    ]

    await createInteractionHistory(existingEquipment[0].id, EQUIPMENT_UPDATED, changes, req.user.id)
    res.status(204).json({ message: "Equipment updated successfully" })
  }),
  updateClientId: tryCatch(async (req, res) => {
    const { equipmentId } = req.params
    const { clientId } = req.body

    updateClientEquipmentSchema.parse(req.body)

    const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
    if (existingEquipment.length <= 0) {
      throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
    }

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const oldClient = await Client.findByClientId(existingEquipment[0].client.id)

    await Equipment.updateClientId(equipmentId, clientId, req.user.id)

    const changes = [
      {
        field: "Cliente",
        before: {
          id: oldClient[0].id,
          name: oldClient[0].name,
          description: oldClient[0].description
        },
        after: {
          id: existingClient[0].id,
          name: existingClient[0].name,
          description: existingClient[0].description
        },
        changed: oldClient[0].id !== Number(clientId)
      }
    ]

    await createInteractionHistory(existingEquipment[0].id, EQUIPMENT_UPDATED, changes, req.user.id)
    res.status(204).json({ message: "Equipment updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { equipmentId } = req.params

    const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
    if (existingEquipment.length <= 0) {
      throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
    }

    await Equipment.delete(equipmentId)
    res.status(204).json({ message: "Equipment deleted successfully" })
  }),
  type: {
    findAll: tryCatch(async (req, res) => {
      const types = await Equipment.type.findAll()
      res.status(200).json(types)
    }),
    findByTypeId: tryCatch(async (req, res) => {
      const { typeId } = req.params

      const existingType = await Equipment.type.findByTypeId(typeId)
      if (existingType.length <= 0) {
        throw new AppError(404, TYPE_NOT_FOUND, "Type not found", true)
      }

      res.status(200).json(existingType)
    }),
    create: tryCatch(async (req, res) => {
      const { name } = req.body

      typeSchema.parse(req.body)

      const existingType = await Equipment.type.findByName(name)
      if (existingType.length > 0) {
        throw new AppError(400, DUPLICATE_TYPE_NAME, "Type with the same name already exists", true)
      }

      await Equipment.type.create(name, req.user.id)
      res.status(201).json({ message: "Type created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { typeId } = req.params
      const { name } = req.body

      typeSchema.parse(req.body)

      const existingType = await Equipment.type.findByTypeId(typeId)
      if (existingType.length <= 0) {
        throw new AppError(404, TYPE_NOT_FOUND, "Type not found", true)
      }

      const duplicateType = await Equipment.type.findByName(name)
      if (duplicateType.length > 0 && duplicateType[0].id !== Number(typeId)) {
        throw new AppError(400, DUPLICATE_TYPE_NAME, "Type with the same name already exists", true)
      }

      await Equipment.type.update(typeId, name, req.user.id)
      res.status(204).json({ message: "Type updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { typeId } = req.params

      const existingType = await Equipment.type.findByTypeId(typeId)
      if (existingType.length <= 0) {
        throw new AppError(404, TYPE_NOT_FOUND, "Type not found", true)
      }

      const relatedEquipments = await Equipment.findByTypeId(typeId)
      if (relatedEquipments.length > 0) {
        throw new AppError(
          400,
          EQUIPMENTS_ASSOCIATED_WITH_TYPE,
          "This type cannot be deleted. It is associated with one or more equipments",
          true
        )
      }

      await Equipment.type.delete(typeId)
      res.status(204).json({ message: "Type deleted successfully" })
    })
  },
  brand: {
    findAll: tryCatch(async (req, res) => {
      const brands = await Equipment.brand.findAll()
      res.status(200).json(brands)
    }),
    findByBrandId: tryCatch(async (req, res) => {
      const { brandId } = req.params

      const existingBrand = await Equipment.brand.findByBrandId(brandId)
      if (existingBrand.length <= 0) {
        throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
      }

      res.status(200).json(existingBrand)
    }),
    create: tryCatch(async (req, res) => {
      const { name } = req.body

      brandSchema.parse(req.body)

      const duplicateBrand = await Equipment.brand.findByName(name)
      if (duplicateBrand.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_BRAND_NAME,
          "Brand with the same name already exists",
          true
        )
      }

      await Equipment.brand.create(name, req.user.id)
      res.status(201).json({ message: "Brand created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { brandId } = req.params
      const { name } = req.body

      brandSchema.parse(req.body)

      const existingBrand = await Equipment.brand.findByBrandId(brandId)
      if (existingBrand.length <= 0) {
        throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
      }

      const duplicateBrand = await Equipment.brand.findByName(name)
      if (duplicateBrand.length > 0 && duplicateBrand[0].id !== Number(brandId)) {
        throw new AppError(
          400,
          DUPLICATE_BRAND_NAME,
          "Brand with the same name already exists",
          true
        )
      }

      await Equipment.brand.update(brandId, name, req.user.id)
      res.status(204).json({ message: "Brand updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { brandId } = req.params

      const existingBrand = await Equipment.brand.findByBrandId(brandId)
      if (existingBrand.length <= 0) {
        throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
      }

      const relatedEquipments = await Equipment.findByBrandId(brandId)
      if (relatedEquipments.length > 0) {
        throw new AppError(
          400,
          EQUIPMENTS_ASSOCIATED_WITH_BRAND,
          "This brand cannot be deleted. It is associated with one or more equipments",
          true
        )
      }

      await Equipment.brand.delete(brandId)
      res.status(204).json({ message: "Brand deleted successfully" })
    })
  },
  model: {
    findAll: tryCatch(async (req, res) => {
      const models = await Equipment.model.findAll()
      res.status(200).json(models)
    }),
    findByModelId: tryCatch(async (req, res) => {
      const { modelId } = req.params

      const existingModel = await Equipment.model.findByModelId(modelId)
      if (existingModel.length <= 0) {
        throw new AppError(404, MODEL_NOT_FOUND, "Model not found", true)
      }

      res.status(200).json(existingModel)
    }),
    findByBrandId: tryCatch(async (req, res) => {
      const { brandId } = req.params

      const existingBrand = await Equipment.brand.findByBrandId(brandId)
      if (existingBrand.length <= 0) {
        throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
      }

      const models = await Equipment.model.findByBrandId(brandId)
      res.status(200).json(models)
    }),
    create: tryCatch(async (req, res) => {
      const { brandId, name } = req.body

      modelSchema.parse(req.body)

      const existingBrand = await Equipment.brand.findByBrandId(brandId)
      if (existingBrand.length <= 0) {
        throw new AppError(404, BRAND_NOT_FOUND, "Brand not found", true)
      }

      const duplicateModel = await Equipment.model.findByNameAndBrandId(name, brandId)
      if (duplicateModel.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_MODEL_NAME,
          "Model with the same name already exists for this brand",
          true
        )
      }

      await Equipment.model.create(brandId, name, req.user.id)
      res.status(201).json({ message: "Model created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { modelId } = req.params
      const { name } = req.body

      modelSchema.parse(req.body)

      const existingModel = await Equipment.model.findByModelId(modelId)
      if (existingModel.length <= 0) {
        throw new AppError(404, MODEL_NOT_FOUND, "Model not found", true)
      }

      const duplicateModel = await Equipment.model.findByNameAndBrandId(
        name,
        existingModel[0].brand.id
      )
      if (duplicateModel.length > 0 && duplicateModel[0].id !== Number(modelId)) {
        throw new AppError(
          400,
          DUPLICATE_MODEL_NAME,
          "Model with the same name already exists for this brand",
          true
        )
      }

      await Equipment.model.update(modelId, name, req.user.id)
      res.status(204).json({ message: "Model updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { modelId } = req.params

      const existingModel = await Equipment.model.findByModelId(modelId)
      if (existingModel.length <= 0) {
        throw new AppError(404, MODEL_NOT_FOUND, "Model not found", true)
      }

      const relatedEquipments = await Equipment.findByModelId(modelId)
      if (relatedEquipments.length > 0) {
        throw new AppError(
          400,
          EQUIPMENTS_ASSOCIATED_WITH_MODEL,
          "This model cannot be deleted. It is associated with one or more equipments",
          true
        )
      }

      await Equipment.model.delete(modelId)
      res.status(204).json({ message: "Model deleted successfully" })
    })
  },
  attachment: {
    uploadAttachments: upload.multiple("attachments"),
    sendAttachment: tryCatch(async (req, res) => {
      const { equipmentId, attachmentId } = req.params

      const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
      if (existingEquipment.length <= 0) {
        throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
      }

      const attachment = await Equipment.attachment.findByAttachmentId(attachmentId)
      if (attachment.length <= 0) {
        throw new AppError(404, ATTACHMENT_NOT_FOUND, "Attachment not found", true)
      }

      const attachmentType = attachment[0].type
      const attachmentBuffer = Buffer.from(attachment[0].file)

      const originalFilename = attachment[0].original_filename

      let readStream = new PassThrough()

      if (attachmentType === "image") {
        const { size, quality, blur } = req.query
        const options = {
          size: parseInt(size),
          quality: quality || "high",
          blur: blur ? parseInt(blur) : false
        }

        const processedImageBuffer = await processImage(attachmentBuffer, options)
        readStream.end(processedImageBuffer)
      } else {
        readStream.end(attachmentBuffer)
      }

      res.setHeader("Content-Disposition", `inline; filename="${originalFilename}"`)
      res.setHeader("Content-Type", attachmentType === "image" ? "image/jpeg" : "application/pdf")

      readStream.pipe(res)

      readStream.on("error", () => {
        throw new AppError(
          500,
          ATTACHMENT_STREAMING_ERROR,
          "Attachment streaming error",
          false,
          ATTACHMENT_ERROR_TYPE
        )
      })

      readStream.on("end", () => {
        res.end()
      })
    }),
    findByEquipmentId: tryCatch(async (req, res) => {
      const { equipmentId } = req.params

      const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
      if (existingEquipment.length <= 0) {
        throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
      }

      const attachments = await Equipment.attachment.findByAttachmentId(equipmentId)
      res.status(200).json(attachments)
    }),
    create: tryCatch(async (req, res) => {
      const { equipmentId } = req.params
      const files = req.files

      if (!files || files.length <= 0) {
        throw new AppError(400, NO_FILES_UPLOADED, "Please upload at least one file", true)
      }

      const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
      if (existingEquipment.length <= 0) {
        throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
      }

      const attachments = files.map((file) => {
        const type =
          file && file.mimetype && file.mimetype.startsWith("image/") ? "image" : "document"

        return {
          file: file.buffer,
          fileMimeType: file.mimetype,
          fileSize: file.size,
          originalFilename: file.originalname,
          type: type,
          uploadedByUserId: req.user.id
        }
      })

      await Equipment.attachment.create(equipmentId, attachments, req.user.id)

      const changes = [
        {
          field: "Anexos",
          after: attachments.map((result) => ({
            original_filename: result.originalFilename,
            file_mime_type: result.fileMimeType,
            file_size: result.fileSize,
            type: result.type
          }))
        }
      ]

      await createInteractionHistory(
        existingEquipment[0].id,
        EQUIPMENT_ATTACHMENT_CREATED,
        changes,
        req.user.id
      )
      res.status(201).json({ message: "Attachments added successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { equipmentId, attachmentId } = req.params

      const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
      if (existingEquipment.length <= 0) {
        throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
      }

      const existingAttachment = await Equipment.attachment.findByAttachmentId(attachmentId)
      if (existingAttachment.length <= 0) {
        throw new AppError(404, ATTACHMENT_NOT_FOUND, "Attachment not found", true)
      }

      await Equipment.attachment.delete(equipmentId, attachmentId)

      const changes = [
        {
          field: "Anexos",
          before: {
            original_filename: existingAttachment[0].original_filename,
            file_mime_type: existingAttachment[0].file_mime_type,
            file_size: existingAttachment[0].file_size,
            type: existingAttachment[0].type
          }
        }
      ]

      await createInteractionHistory(
        existingEquipment[0].id,
        EQUIPMENT_ATTACHMENT_DELETED,
        changes,
        req.user.id
      )
      res.status(204).json({ message: "Attachment deleted successfully" })
    })
  },
  interactionsHistory: {
    findByEquipmentId: tryCatch(async (req, res) => {
      const { equipmentId } = req.params

      const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
      if (existingEquipment.length <= 0) {
        throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
      }

      const interactionsHistory = await Equipment.interactionsHistory.findByEquipmentId(equipmentId)
      res.status(200).json(interactionsHistory)
    })
  }
}

const createInteractionHistory = async (equipmentId, interactionType, changes, userId) => {
  await Equipment.interactionsHistory.create(
    equipmentId,
    interactionType,
    JSON.stringify(changes),
    userId
  )
}

module.exports = equipmentController
