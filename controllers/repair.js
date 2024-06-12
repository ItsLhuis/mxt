const fs = require("fs")
const path = require("path")

const { PassThrough } = require("stream")

const { produce } = require("immer")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const processImage = require("@utils/processImage")

const {
  REPAIR_NOT_FOUND,
  REPAIR_STATUS_NOT_FOUND,
  ENTRY_ACCESSORY_NOT_FOUND,
  ENTRY_REPORTED_ISSUE_NOT_FOUND,
  INTERVENTION_WORK_DONE_NOT_FOUND,
  INTERVENTION_ACCESSORY_USED_NOT_FOUND
} = require("@constants/errors/repair")
const { EQUIPMENT_NOT_FOUND } = require("@constants/errors/equipment")
const { ATTACHMENT_STREAMING_ERROR } = require("@constants/errors/shared/attachment")

const { ATTACHMENT_ERROR_TYPE } = require("@constants/errors/shared/types")

const {
  REPAIR_CREATED,
  REPAIR_UPDATED,
  REPAIR_ATTACHMENT_CREATED,
  REPAIR_ATTACHMENT_DELETED
} = require("@constants/interactions/repair")

const roles = require("@constants/roles")

const Repair = require("@models/repair")
const { repairSchema, updateRepairSchema } = require("@schemas/repair")

const Equipment = require("@models/equipment")

const upload = require("@middlewares/uploadFileHandler")

const equipmentController = {
  findAll: tryCatch(async (req, res) => {
    const repairs = await Repair.findAll()

    const includeInteractionsHistory = req.user.role !== roles.EMPLOYEE

    const filteredRepairs = produce(repairs, (draft) => {
      if (!includeInteractionsHistory) {
        draft.forEach((repair) => {
          delete repair.interactions_history
        })
      }
    })

    res.status(200).json(filteredRepairs)
  }),
  findByRepairId: tryCatch(async (req, res) => {
    const { repairId } = req.params

    const existingRepair = await Repair.findByRepairId(repairId)
    if (existingRepair.length <= 0) {
      throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
    }

    const includeInteractionsHistory = req.user.role !== roles.EMPLOYEE

    const filteredRepairs = produce(existingRepair[0], (draft) => {
      if (!includeInteractionsHistory) {
        delete draft.interactions_history
      }
    })

    res.status(200).json([filteredRepairs])
  }),
  create: tryCatch(async (req, res) => {
    const {
      equipmentId,
      statusId,
      clientOsPassword,
      clientBiosPassword,
      entryDescription,
      entryDatetime
    } = req.body

    repairSchema.parse(req.body)

    const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
    if (existingEquipment.length <= 0) {
      throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
    }

    const existingStatus = await Repair.status.findByStatusId(statusId)
    if (existingStatus.length <= 0) {
      throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Repair status not found", true)
    }

    await Repair.create(
      equipmentId,
      statusId,
      clientOsPassword,
      clientBiosPassword,
      entryDescription,
      entryDatetime,
      req.user.id
    )
    res.status(201).json({ message: "Repair created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { repairId } = req.params
    const {
      statusId,
      clientOsPassword,
      clientBiosPassword,
      entryAccessoriesDescription,
      entryReportedIssuesDescription,
      entryDescription,
      entryDatetime,
      interventionWorksDoneDescription,
      interventionAccessoriesUsedDescription,
      interventionDescription,
      conclusionDatetime,
      deliveryDatetime,
      entryAccessoriesIds,
      entryReportedIssuesIds,
      interventionWorksDoneIds,
      interventionAccessoriesUsedIds
    } = req.body

    updateRepairSchema.parse(req.body)

    const existingRepair = await Repair.findByRepairId(repairId)
    if (existingRepair.length <= 0) {
      throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
    }

    const existingStatus = await Repair.status.findByStatusId(statusId)
    if (existingStatus.length <= 0) {
      throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Repair status not found", true)
    }

    for (const entryAccessoryId of entryAccessoriesIds) {
      const existingEntryAccessory = await Repair.entryAccessory.findByAccessoryId(entryAccessoryId)
      if (existingEntryAccessory.length <= 0) {
        throw new AppError(404, ENTRY_ACCESSORY_NOT_FOUND, "Entry accessory not found", true)
      }
    }

    for (const entryReportedIssueId of entryReportedIssuesIds) {
      const existingEntryReportedIssue = await Repair.entryReportedIssue.findByReportedIssueId(
        entryReportedIssueId
      )
      if (existingEntryReportedIssue.length <= 0) {
        throw new AppError(
          404,
          ENTRY_REPORTED_ISSUE_NOT_FOUND,
          "Entry reported issue not found",
          true
        )
      }
    }

    for (const interventionWorkDoneId of interventionWorksDoneIds) {
      const existingInterventionWorkDone =
        await Repair.interventionWorkDone.findByInterventionWorkDoneId(interventionWorkDoneId)
      if (existingInterventionWorkDone.length <= 0) {
        throw new AppError(
          404,
          INTERVENTION_WORK_DONE_NOT_FOUND,
          "Intervention work done not found",
          true
        )
      }
    }

    for (const interventionAccessoryUsedId of interventionAccessoriesUsedIds) {
      const existingInterventionAccessoryUsed =
        await Repair.interventionAccessoryUsed.findByInterventionWorkDoneId(
          interventionAccessoryUsedId
        )
      if (existingInterventionAccessoryUsed.length <= 0) {
        throw new AppError(
          404,
          INTERVENTION_ACCESSORY_USED_NOT_FOUND,
          "Intervention accessory used not found",
          true
        )
      }
    }

    await Repair.update(
      repairId,
      statusId,
      clientOsPassword,
      clientBiosPassword,
      entryAccessoriesDescription,
      entryReportedIssuesDescription,
      entryDescription,
      entryDatetime,
      interventionWorksDoneDescription,
      interventionAccessoriesUsedDescription,
      interventionDescription,
      conclusionDatetime,
      deliveryDatetime,
      req.user.id,
      {
        entryAccessoriesIds,
        entryReportedIssuesIds,
        interventionWorksDoneIds,
        interventionAccessoriesUsedIds
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
