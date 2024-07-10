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
  INTERVENTION_ACCESSORY_USED_NOT_FOUND,
  DUPLICATE_REPAIR_STATUS_NAME,
  REPAIRS_ASSOCIATED_WITH_STATUS,
  REPAIR_ENTRY_ACCESSORY_NOT_FOUND,
  DUPLICATE_ENTRY_ACCESSOR_NAME,
  REPAIRS_ASSOCIATED_WITH_ENTRY_ACCESSORY,
  REPAIR_ENTRY_REPORTED_ISSUE_NOT_FOUND,
  DUPLICATE_ENTRY_REPORTED_ISSUE_NAME,
  REPAIRS_ASSOCIATED_WITH_ENTRY_REPORTED_ISSUE,
  REPAIR_INTERVENTION_WORK_DONE_NOT_FOUND,
  DUPLICATE_INTERVENTION_WORK_DONE_NAME,
  REPAIRS_ASSOCIATED_WITH_INTERVENTION_WORK_DONE,
  REPAIR_INTERVENTION_ACCESSORY_USED_NOT_FOUND,
  DUPLICATE_INTERVENTION_ACCESSORY_USED_NAME,
  REPAIRS_ASSOCIATED_WITH_INTERVENTION_ACCESSORY_USED,
  NO_FILES_UPLOADED,
  ATTACHMENT_NOT_FOUND
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
const { repairSchema, updateRepairSchema, optionsSchema } = require("@schemas/repair")

const Equipment = require("@models/equipment")

const { upload } = require("@middlewares/uploadFileHandler")

const repairController = {
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
    const { equipmentId, statusId, entryDescription, entryDatetime } = req.body

    repairSchema.parse(req.body)

    const existingEquipment = await Equipment.findByEquipmentId(equipmentId)
    if (existingEquipment.length <= 0) {
      throw new AppError(404, EQUIPMENT_NOT_FOUND, "Equipment not found", true)
    }

    const existingStatus = await Repair.status.findByStatusId(statusId)
    if (existingStatus.length <= 0) {
      throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Repair status not found", true)
    }

    const newRepair = await Repair.create(
      equipmentId,
      statusId,
      entryDescription,
      entryDatetime,
      req.user.id
    )

    const changes = [
      {
        field: "Equipamento",
        after: {
          id: existingEquipment[0].id,
          client: existingEquipment[0].client,
          brand: existingEquipment[0].brand,
          model: existingEquipment[0].model,
          type: existingEquipment[0].type,
          sn: existingEquipment[0].sn,
          description: existingEquipment[0].description
        }
      },
      {
        field: "Estado",
        after: {
          id: existingStatus[0].id,
          name: existingStatus[0].name,
          is_default: existingStatus[0].is_default
        }
      },
      { field: "Data de entrada", after: entryDatetime },
      { field: "Descrição da entrada", after: !entryDescription ? null : entryDescription }
    ]

    await createInteractionHistory(newRepair.insertId, REPAIR_CREATED, changes, req.user.id)
    res.status(201).json({ message: "Repair created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { repairId } = req.params
    const {
      statusId,
      entryAccessoriesDescription,
      entryReportedIssuesDescription,
      entryDescription,
      entryDatetime,
      interventionWorksDoneDescription,
      interventionAccessoriesUsedDescription,
      interventionDescription,
      conclusionDatetime,
      deliveryDatetime,
      isClientNotified,
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

    const entryAccessoriesOld = await Repair.entryAccessory.findByRepairId(repairId)
    const entryReportedIssuesOld = await Repair.entryReportedIssue.findByRepairId(repairId)
    const interventionWorksDoneOld = await Repair.interventionWorkDone.findByRepairId(repairId)
    const interventionAccessoriesUsedOld = await Repair.interventionAccessoryUsed.findByRepairId(
      repairId
    )

    const entryAccessoriesNew = []
    for (const entryAccessoryId of entryAccessoriesIds) {
      const existingEntryAccessory = await Repair.entryAccessory.findByAccessoryId(entryAccessoryId)
      if (existingEntryAccessory.length <= 0) {
        throw new AppError(404, ENTRY_ACCESSORY_NOT_FOUND, "Entry accessory not found", true)
      }
      entryAccessoriesNew.push({ id: entryAccessoryId, name: existingEntryAccessory[0].name })
    }

    const entryReportedIssuesNew = []
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
      entryReportedIssuesNew.push({
        id: entryReportedIssueId,
        name: existingEntryReportedIssue[0].name
      })
    }

    const interventionWorksDoneNew = []
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
      interventionWorksDoneNew.push({
        id: interventionWorkDoneId,
        name: existingInterventionWorkDone[0].name
      })
    }

    const interventionAccessoriesUsedNew = []
    for (const interventionAccessoryUsedId of interventionAccessoriesUsedIds) {
      const existingInterventionAccessoryUsed =
        await Repair.interventionAccessoryUsed.findByInterventionAccessoryUsedId(
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
      interventionAccessoriesUsedNew.push({
        id: interventionAccessoryUsedId,
        name: existingInterventionAccessoryUsed[0].name
      })
    }

    await Repair.update(
      repairId,
      statusId,
      entryAccessoriesDescription,
      entryReportedIssuesDescription,
      entryDescription,
      entryDatetime,
      interventionWorksDoneDescription,
      interventionAccessoriesUsedDescription,
      interventionDescription,
      conclusionDatetime,
      deliveryDatetime,
      isClientNotified,
      req.user.id,
      entryAccessoriesIds,
      entryReportedIssuesIds,
      interventionWorksDoneIds,
      interventionAccessoriesUsedIds
    )

    const compareAndPushArrayChanges = (oldArray, newArray, fieldName) => {
      const before = oldArray.map((item) => ({ id: item.id, name: item.name }))
      const after = newArray.map((item) => ({ id: item.id, name: item.name }))

      const changed = JSON.stringify(before) !== JSON.stringify(after)

      changes.push({
        field: fieldName,
        before: before,
        after: after,
        changed: changed
      })
    }

    const changes = [
      {
        field: "Estado",
        before: {
          id: existingRepair[0].status.id,
          name: existingRepair[0].status.name,
          is_default: existingRepair[0].status.is_default
        },
        after: {
          id: existingStatus[0].id,
          name: existingStatus[0].name,
          is_default: existingStatus[0].is_default
        },
        changed: existingRepair[0].status.id !== Number(statusId)
      },
      {
        field: "Data de entrada",
        before: existingRepair[0].entry_datetime,
        after: entryDatetime,
        changed: existingRepair[0].entry_datetime !== entryDatetime
      },
      {
        field: "Descrição da entrada",
        before: existingRepair[0].entry_description,
        after: !entryDescription ? null : entryDescription,
        changed:
          existingRepair[0].entry_description !== (!entryDescription ? null : entryDescription)
      }
    ]

    compareAndPushArrayChanges(entryAccessoriesOld, entryAccessoriesNew, "Acessórios da entrada")

    changes.push({
      field: "Descrição dos acessórios da entrada",
      before: existingRepair[0].entry_accessories_description,
      after: !entryAccessoriesDescription ? null : entryAccessoriesDescription,
      changed:
        existingRepair[0].entry_accessories_description !==
        (!entryAccessoriesDescription ? null : entryAccessoriesDescription)
    })

    compareAndPushArrayChanges(entryReportedIssuesOld, entryReportedIssuesNew, "Avarias relatadas")

    changes.push({
      field: "Descrição das avarias relatadas",
      before: existingRepair[0].entry_reported_issues_description,
      after: !entryReportedIssuesDescription ? null : entryReportedIssuesDescription,
      changed:
        existingRepair[0].entry_reported_issues_description !==
        (!entryReportedIssuesDescription ? null : entryReportedIssuesDescription)
    })

    compareAndPushArrayChanges(
      interventionWorksDoneOld,
      interventionWorksDoneNew,
      "Trabalhos realizados"
    )

    changes.push({
      field: "Descrição dos trabalhos realizados",
      before: existingRepair[0].intervention_works_done_description,
      after: !interventionWorksDoneDescription ? null : interventionWorksDoneDescription,
      changed:
        existingRepair[0].intervention_works_done_description !==
        (!interventionWorksDoneDescription ? null : interventionWorksDoneDescription)
    })

    compareAndPushArrayChanges(
      interventionAccessoriesUsedOld,
      interventionAccessoriesUsedNew,
      "Acessórios da intervenção"
    )

    changes.push({
      field: "Descrição dos acessórios da intervenção",
      before: existingRepair[0].intervention_accessories_used_description,
      after: !interventionAccessoriesUsedDescription
        ? null
        : interventionAccessoriesUsedDescription,
      changed:
        existingRepair[0].intervention_accessories_used_description !==
        (!interventionAccessoriesUsedDescription ? null : interventionAccessoriesUsedDescription)
    })

    changes.push(
      {
        field: "Data de conclusão",
        before: existingRepair[0].conclusion_datetime,
        after: conclusionDatetime,
        changed: existingRepair[0].conclusion_datetime !== conclusionDatetime
      },
      {
        field: "Data de entrega",
        before: existingRepair[0].delivery_datetime,
        after: deliveryDatetime,
        changed: existingRepair[0].delivery_datetime !== deliveryDatetime
      },
      {
        field: "Cliente notificado",
        before: existingRepair[0].is_client_notified,
        after: isClientNotified,
        changed: existingRepair[0].is_client_notified !== isClientNotified
      }
    )

    await createInteractionHistory(repairId, REPAIR_UPDATED, changes, req.user.id)
    res.status(201).json({ message: "Repair updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { repairId } = req.params

    const existingRepair = await Repair.findByRepairId(repairId)
    if (existingRepair.length <= 0) {
      throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
    }

    await Repair.delete(repairId)
    res.status(204).json({ message: "Repair deleted successfully" })
  }),
  status: {
    findAll: tryCatch(async (req, res) => {
      const status = await Repair.status.findAll()
      res.status(200).json(status)
    }),
    findByStatusId: tryCatch(async (req, res) => {
      const { statusId } = req.params

      const existingStatus = await Repair.status.findByStatusId(statusId)
      if (existingStatus.length <= 0) {
        throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Status not found", true)
      }

      res.status(200).json(existingStatus)
    }),
    findByDefaultStatus: tryCatch(async (req, res) => {
      const defaultStatus = await Repair.status.findByDefaultStatus()
      if (defaultStatus.length <= 0) {
        throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Status not found", true)
      }

      res.status(200).json(defaultStatus)
    }),
    create: tryCatch(async (req, res) => {
      const { name, color } = req.body

      optionsSchema.parse(req.body)

      const duplicateStatus = await Repair.status.findByName(name)
      if (duplicateStatus.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_REPAIR_STATUS_NAME,
          "Status with the same name already exists",
          true
        )
      }

      await Repair.status.create(name, color, false, req.user.id)
      res.status(201).json({ message: "Status created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { statusId } = req.params
      const { name, color } = req.body

      optionsSchema.parse(req.body)

      const existingStatus = await Repair.status.findByStatusId(statusId)
      if (existingStatus.length <= 0) {
        throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Status not found", true)
      }

      const duplicateStatus = await Repair.status.findByName(name)
      if (duplicateStatus.length > 0 && duplicateStatus[0].id !== Number(statusId)) {
        throw new AppError(
          400,
          DUPLICATE_REPAIR_STATUS_NAME,
          "Status with the same name already exists",
          true
        )
      }

      await Repair.status.update(statusId, name, color, req.user.id)
      res.status(204).json({ message: "Status updated successfully" })
    }),
    updateDefault: tryCatch(async (req, res) => {
      const { statusId } = req.params

      const existingStatus = await Repair.status.findByStatusId(statusId)
      if (existingStatus.length <= 0) {
        throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Status not found", true)
      }

      await Repair.status.updateDefault(statusId, req.user.id)
      res.status(204).json({ message: "Default status set successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { statusId } = req.params

      const existingStatus = await Repair.status.findByStatusId(statusId)
      if (existingStatus.length <= 0) {
        throw new AppError(404, REPAIR_STATUS_NOT_FOUND, "Status not found", true)
      }

      const relatedRepairs = await Repair.findByStatusId(statusId)
      if (relatedRepairs.length > 0) {
        throw new AppError(
          400,
          REPAIRS_ASSOCIATED_WITH_STATUS,
          "This status cannot be deleted. It is associated with one or more repairs",
          true
        )
      }

      await Repair.status.delete(statusId)
      res.status(204).json({ message: "Status deleted successfully" })
    })
  },
  entryAccessory: {
    findAll: tryCatch(async (req, res) => {
      const status = await Repair.entryAccessory.findAll()
      res.status(200).json(status)
    }),
    findByAccessoryId: tryCatch(async (req, res) => {
      const { entryAccessoryId } = req.params

      const existingEntryAccessoryId = await Repair.entryAccessory.findByAccessoryId(
        entryAccessoryId
      )
      if (existingEntryAccessoryId.length <= 0) {
        throw new AppError(404, REPAIR_ENTRY_ACCESSORY_NOT_FOUND, "Entry accessory not found", true)
      }

      res.status(200).json(existingEntryAccessoryId)
    }),
    create: tryCatch(async (req, res) => {
      const { name } = req.body

      optionsSchema.parse(req.body)

      const duplicateduplicateEntryAccessory = await Repair.entryAccessory.findByName(name)
      if (duplicateduplicateEntryAccessory.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_ENTRY_ACCESSOR_NAME,
          "Entry accessory with the same name already exists",
          true
        )
      }

      await Repair.entryAccessory.create(name, req.user.id)
      res.status(201).json({ message: "Entry accessory created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { entryAccessoryId } = req.params
      const { name } = req.body

      optionsSchema.parse(req.body)

      const existingEntryAccessoryId = await Repair.entryAccessory.findByAccessoryId(
        entryAccessoryId
      )
      if (existingEntryAccessoryId.length <= 0) {
        throw new AppError(404, REPAIR_ENTRY_ACCESSORY_NOT_FOUND, "Entry accessory not found", true)
      }

      const duplicateduplicateEntryAccessory = await Repair.entryAccessory.findByName(name)
      if (duplicateduplicateEntryAccessory.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_ENTRY_ACCESSOR_NAME,
          "Entry accessory with the same name already exists",
          true
        )
      }

      await Repair.entryAccessory.update(entryAccessoryId, name, req.user.id)
      res.status(204).json({ message: "Entry accessory updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { entryAccessoryId } = req.params

      const existingEntryAccessoryId = await Repair.entryAccessory.findByAccessoryId(
        entryAccessoryId
      )
      if (existingEntryAccessoryId.length <= 0) {
        throw new AppError(404, REPAIR_ENTRY_ACCESSORY_NOT_FOUND, "Entry accessory not found", true)
      }

      const relatedRepairs = await Repair.findByEntryAccessoryId(entryAccessoryId)
      if (relatedRepairs.length > 0) {
        throw new AppError(
          400,
          REPAIRS_ASSOCIATED_WITH_ENTRY_ACCESSORY,
          "This entry accessory cannot be deleted. It is associated with one or more repairs",
          true
        )
      }

      await Repair.entryAccessory.delete(entryAccessoryId)
      res.status(204).json({ message: "Entry accessory deleted successfully" })
    })
  },
  entryReportedIssue: {
    findAll: tryCatch(async (req, res) => {
      const reportedIssues = await Repair.entryReportedIssue.findAll()
      res.status(200).json(reportedIssues)
    }),
    findByReportedIssueId: tryCatch(async (req, res) => {
      const { entryReportedIssueId } = req.params

      const existingEntryReportedIssue = await Repair.entryReportedIssue.findByReportedIssueId(
        entryReportedIssueId
      )
      if (existingEntryReportedIssue.length <= 0) {
        throw new AppError(
          404,
          REPAIR_ENTRY_REPORTED_ISSUE_NOT_FOUND,
          "Entry reported issue not found",
          true
        )
      }

      res.status(200).json(existingEntryReportedIssue)
    }),
    create: tryCatch(async (req, res) => {
      const { name } = req.body

      optionsSchema.parse(req.body)

      const duplicateEntryReportedIssue = await Repair.entryReportedIssue.findByName(name)
      if (duplicateEntryReportedIssue.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_ENTRY_REPORTED_ISSUE_NAME,
          "Entry reported issue with the same name already exists",
          true
        )
      }

      await Repair.entryReportedIssue.create(name, req.user.id)
      res.status(201).json({ message: "Entry reported issue created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { entryReportedIssueId } = req.params
      const { name } = req.body

      optionsSchema.parse(req.body)

      const existingEntryReportedIssue = await Repair.entryReportedIssue.findByReportedIssueId(
        entryReportedIssueId
      )
      if (existingEntryReportedIssue.length <= 0) {
        throw new AppError(
          404,
          REPAIR_ENTRY_REPORTED_ISSUE_NOT_FOUND,
          "Entry reported issue not found",
          true
        )
      }

      const duplicateEntryReportedIssue = await Repair.entryReportedIssue.findByName(name)
      if (duplicateEntryReportedIssue.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_ENTRY_REPORTED_ISSUE_NAME,
          "Entry reported issue with the same name already exists",
          true
        )
      }

      await Repair.entryReportedIssue.update(entryReportedIssueId, name, req.user.id)
      res.status(204).json({ message: "Entry reported issue updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { entryReportedIssueId } = req.params

      const existingEntryReportedIssue = await Repair.entryReportedIssue.findByReportedIssueId(
        entryReportedIssueId
      )
      if (existingEntryReportedIssue.length <= 0) {
        throw new AppError(
          404,
          REPAIR_ENTRY_REPORTED_ISSUE_NOT_FOUND,
          "Entry reported issue not found",
          true
        )
      }

      const relatedRepairs = await Repair.findByEntryReportedIssueId(entryReportedIssueId)
      if (relatedRepairs.length > 0) {
        throw new AppError(
          400,
          REPAIRS_ASSOCIATED_WITH_ENTRY_REPORTED_ISSUE,
          "This entry reported issue cannot be deleted. It is associated with one or more repairs",
          true
        )
      }

      await Repair.entryReportedIssue.delete(entryReportedIssueId)
      res.status(204).json({ message: "Entry reported issue deleted successfully" })
    })
  },
  interventionWorkDone: {
    findAll: tryCatch(async (req, res) => {
      const interventionWorksDone = await Repair.interventionWorkDone.findAll()
      res.status(200).json(interventionWorksDone)
    }),
    findByInterventionWorkDoneId: tryCatch(async (req, res) => {
      const { interventionWorkDoneId } = req.params

      const existingInterventionWorkDone =
        await Repair.interventionWorkDone.findByInterventionWorkDoneId(interventionWorkDoneId)
      if (existingInterventionWorkDone.length <= 0) {
        throw new AppError(
          404,
          REPAIR_INTERVENTION_WORK_DONE_NOT_FOUND,
          "Intervention work done not found",
          true
        )
      }

      res.status(200).json(existingInterventionWorkDone)
    }),
    create: tryCatch(async (req, res) => {
      const { name } = req.body

      optionsSchema.parse(req.body)

      const duplicateInterventionWorkDone = await Repair.interventionWorkDone.findByName(name)
      if (duplicateInterventionWorkDone.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_INTERVENTION_WORK_DONE_NAME,
          "Intervention work done with the same name already exists",
          true
        )
      }

      await Repair.interventionWorkDone.create(name, req.user.id)
      res.status(201).json({ message: "Intervention work done created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { interventionWorkDoneId } = req.params
      const { name } = req.body

      optionsSchema.parse(req.body)

      const existingInterventionWorkDone =
        await Repair.interventionWorkDone.findByInterventionWorkDoneId(interventionWorkDoneId)
      if (existingInterventionWorkDone.length <= 0) {
        throw new AppError(
          404,
          REPAIR_INTERVENTION_WORK_DONE_NOT_FOUND,
          "Intervention work done not found",
          true
        )
      }

      const duplicateInterventionWorkDone = await Repair.interventionWorkDone.findByName(name)
      if (duplicateInterventionWorkDone.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_INTERVENTION_WORK_DONE_NAME,
          "Intervention work done with the same name already exists",
          true
        )
      }

      await Repair.interventionWorkDone.update(interventionWorkDoneId, name, req.user.id)
      res.status(204).json({ message: "Intervention work done updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { interventionWorkDoneId } = req.params

      const existingInterventionWorkDone =
        await Repair.interventionWorkDone.findByInterventionWorkDoneId(interventionWorkDoneId)
      if (existingInterventionWorkDone.length <= 0) {
        throw new AppError(
          404,
          REPAIR_INTERVENTION_WORK_DONE_NOT_FOUND,
          "Intervention work done not found",
          true
        )
      }

      const relatedRepairs = await Repair.findByInterventionWorkDoneId(interventionWorkDoneId)
      if (relatedRepairs.length > 0) {
        throw new AppError(
          400,
          REPAIRS_ASSOCIATED_WITH_INTERVENTION_WORK_DONE,
          "This intervention work done cannot be deleted. It is associated with one or more repairs",
          true
        )
      }

      await Repair.interventionWorkDone.delete(interventionWorkDoneId)
      res.status(204).json({ message: "Intervention work done deleted successfully" })
    })
  },
  interventionAccessoryUsed: {
    findAll: tryCatch(async (req, res) => {
      const interventionAccessoriesUsed = await Repair.interventionAccessoryUsed.findAll()
      res.status(200).json(interventionAccessoriesUsed)
    }),
    findByInterventionAccessoryUsedId: tryCatch(async (req, res) => {
      const { interventionAccessoryUsedId } = req.params

      const existingInterventionAccessoryUsed =
        await Repair.interventionAccessoryUsed.findByInterventionAccessoryUsedId(
          interventionAccessoryUsedId
        )
      if (existingInterventionAccessoryUsed.length <= 0) {
        throw new AppError(
          404,
          REPAIR_INTERVENTION_ACCESSORY_USED_NOT_FOUND,
          "Intervention accessory used not found",
          true
        )
      }

      res.status(200).json(existingInterventionAccessoryUsed)
    }),
    create: tryCatch(async (req, res) => {
      const { name } = req.body

      optionsSchema.parse(req.body)

      const duplicateInterventionAccessoryUsed = await Repair.interventionAccessoryUsed.findByName(
        name
      )
      if (duplicateInterventionAccessoryUsed.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_INTERVENTION_ACCESSORY_USED_NAME,
          "Intervention accessory used with the same name already exists",
          true
        )
      }

      await Repair.interventionAccessoryUsed.create(name, req.user.id)
      res.status(201).json({ message: "Intervention accessory used created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { interventionAccessoryUsedId } = req.params
      const { name } = req.body

      optionsSchema.parse(req.body)

      const existingInterventionAccessoryUsed =
        await Repair.interventionAccessoryUsed.findByInterventionAccessoryUsedId(
          interventionAccessoryUsedId
        )
      if (existingInterventionAccessoryUsed.length <= 0) {
        throw new AppError(
          404,
          REPAIR_INTERVENTION_ACCESSORY_USED_NOT_FOUND,
          "Intervention accessory used not found",
          true
        )
      }

      const duplicateInterventionAccessoryUsed = await Repair.interventionAccessoryUsed.findByName(
        name
      )
      if (duplicateInterventionAccessoryUsed.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_INTERVENTION_ACCESSORY_USED_NAME,
          "Intervention accessory used with the same name already exists",
          true
        )
      }

      await Repair.interventionAccessoryUsed.update(interventionAccessoryUsedId, name, req.user.id)
      res.status(204).json({ message: "Intervention accessory used updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { interventionAccessoryUsedId } = req.params

      const existingInterventionAccessoryUsed =
        await Repair.interventionAccessoryUsed.findByInterventionAccessoryUsedId(
          interventionAccessoryUsedId
        )
      if (existingInterventionAccessoryUsed.length <= 0) {
        throw new AppError(
          404,
          REPAIR_INTERVENTION_ACCESSORY_USED_NOT_FOUND,
          "Intervention accessory used not found",
          true
        )
      }

      const relatedRepairs = await Repair.findByInterventionAccessoryUsedId(
        interventionAccessoryUsedId
      )
      if (relatedRepairs.length > 0) {
        throw new AppError(
          400,
          REPAIRS_ASSOCIATED_WITH_INTERVENTION_ACCESSORY_USED,
          "This intervention accessory used cannot be deleted. It is associated with one or more repairs",
          true
        )
      }

      await Repair.interventionAccessoryUsed.delete(interventionAccessoryUsedId)
      res.status(204).json({ message: "Intervention accessory used deleted successfully" })
    })
  },
  attachment: {
    uploadAttachments: upload.multiple("attachments"),
    sendAttachment: tryCatch(async (req, res) => {
      const { repairId, attachmentId } = req.params

      const existingRepair = await Repair.findByRepairId(repairId)
      if (existingRepair.length <= 0) {
        throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
      }

      const attachment = await Repair.attachment.findByAttachmentId(attachmentId)
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
    findByRepairId: tryCatch(async (req, res) => {
      const { repairId } = req.params

      const existingRepair = await Repair.findByRepairId(repairId)
      if (existingRepair.length <= 0) {
        throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
      }

      const attachments = await Repair.attachment.findByAttachmentId(repairId)
      res.status(200).json(attachments)
    }),
    create: tryCatch(async (req, res) => {
      const { repairId } = req.params
      const files = req.files

      if (!files || files.length <= 0) {
        throw new AppError(400, NO_FILES_UPLOADED, "Please upload at least one file", true)
      }

      const existingRepair = await Repair.findByRepairId(repairId)
      if (existingRepair.length <= 0) {
        throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
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

      await Repair.attachment.create(repairId, attachments, req.user.id)

      const changes = [
        {
          field: "Attachments",
          after: attachments.map((result) => ({
            id: result.insertId,
            original_filename: result.originalFilename,
            type: result.type
          }))
        }
      ]

      await createInteractionHistory(
        existingRepair[0].id,
        REPAIR_ATTACHMENT_CREATED,
        changes,
        req.user.id
      )
      res.status(201).json({ message: "Attachments added successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { repairId, attachmentId } = req.params

      const existingRepair = await Repair.findByRepairId(repairId)
      if (existingRepair.length <= 0) {
        throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
      }

      const existingAttachment = await Repair.attachment.findByAttachmentId(attachmentId)
      if (existingAttachment.length <= 0) {
        throw new AppError(404, ATTACHMENT_NOT_FOUND, "Attachment not found", true)
      }

      await Repair.attachment.delete(repairId, attachmentId)

      const changes = [
        {
          field: "Attachments",
          before: {
            id: existingAttachment[0].id,
            original_filename: existingAttachment[0].original_filename,
            type: existingAttachment[0].type
          }
        }
      ]

      await createInteractionHistory(
        existingRepair[0].id,
        REPAIR_ATTACHMENT_DELETED,
        changes,
        req.user.id
      )
      res.status(204).json({ message: "Attachment deleted successfully" })
    })
  },
  interactionsHistory: {
    findByRepairId: tryCatch(async (req, res) => {
      const { repairId } = req.params

      const existingRepair = await Repair.findByRepairId(repairId)
      if (existingRepair.length <= 0) {
        throw new AppError(404, REPAIR_NOT_FOUND, "Repair not found", true)
      }

      const interactionsHistory = await Repair.interactionsHistory.findByRepairId(repairId)
      res.status(200).json(interactionsHistory)
    })
  }
}

const createInteractionHistory = async (repairId, interactionType, changes, userId) => {
  await Repair.interactionsHistory.create(
    repairId,
    interactionType,
    JSON.stringify(changes),
    userId
  )
}

module.exports = repairController
