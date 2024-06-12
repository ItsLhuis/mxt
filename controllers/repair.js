const fs = require("fs")
const path = require("path")

const { PassThrough } = require("stream")

const { produce } = require("immer")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const processImage = require("@utils/processImage")

const {
  EQUIPMENT_NOT_FOUND,
  NO_FILES_UPLOADED,
  ATTACHMENT_NOT_FOUND,
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
  EQUIPMENTS_ASSOCIATED_WITH_TYPE
} = require("@constants/errors/equipment")
const { CLIENT_NOT_FOUND } = require("@constants/errors/client")
const { ATTACHMENT_STREAMING_ERROR } = require("@constants/errors/shared/attachment")

const { ATTACHMENT_ERROR_TYPE } = require("@constants/errors/shared/types")

const {
  EQUIPMENT_CREATED,
  EQUIPMENT_UPDATED,
  EQUIPMENT_ATTACHMENT_CREATED,
  EQUIPMENT_ATTACHMENT_DELETED
} = require("@constants/interactions/equipment")

const roles = require("@constants/roles")

const Repair = require("@models/repair")
const {
  equipmentSchema,
  updateEquipmentSchema,
  updateClientEquipmentSchema,
  brandSchema,
  modelSchema,
  typeSchema
} = require("@schemas/equipment")

const Client = require("@models/client")

const upload = require("@middlewares/uploadFileHandler")

const equipmentController = {
  findAll: tryCatch(async (req, res) => {
    const allRepairs = await Repair.findAll()
    res.status(200).json(allRepairs)
  }),
  findByRepairId: tryCatch(async (req, res) => {}),
  create: tryCatch(async (req, res) => {
    await Repair.create(1, 1, null, null, null, new Date(), req.user.id)
    res.status(201).json({ message: "Repair created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    await Repair.update(
      1,
      1,
      "123123",
      "123123",
      "entryAccessoriesDescription",
      "entryReportedIssuesDescription",
      "entryDescription",
      new Date(),
      "interventionWorksDoneDescription",
      "interventionAccessoriesUsedDescription",
      "interventionDescription",
      new Date(),
      new Date(),
      req.user.id,
      {
        entryAccessoriesIds: [1, 2],
        entryReportedIssuesIds: [1, 2],
        interventionWorksDoneIds: [1, 2],
        interventionAccessoriesUsedIds: [1, 2]
      }
    )
    res.status(201).json({ message: "Repair updated successfully" })
  })
}

/* const createInteractionHistory = async (equipmentId, interactionType, changes, userId) => {
  await Repair.interactionsHistory.create(
    equipmentId,
    interactionType,
    JSON.stringify(changes),
    userId
  )
} */

module.exports = equipmentController
