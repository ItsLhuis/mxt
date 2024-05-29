const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { EQUIPMENT_NOT_FOUND } = require("@constants/errors/equipment")

const { EQUIPMENT_CREATED } = require("@constants/interactions/equipment")

const Equipment = require("@models/equipment")
const { equipmentSchema } = require("@schemas/equipment")

const equipmentController = {
  findAll: tryCatch(async (req, res) => {
    const equipments = await Equipment.findAll()
    res.status(200).json(equipments)
  }),
  create: tryCatch(async (req, res) => {
    const { name, description } = req.body

    clientSchema.parse(req.body)

    const newClient = await Client.create(name, description, req.user.id)

    const changes = [
      { field: "Nome", after: name },
      { field: "Descrição", after: !description ? null : description }
    ]

    await createInteractionHistory(newClient.insertId, CLIENT_CREATED, changes, req.user.id)
    res.status(201).json({ message: "Client created successfully" })
  })
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
