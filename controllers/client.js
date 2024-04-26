const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { CLIENT_NOT_FOUND } = require("@constants/errors/client")

const Client = require("@models/client")
const { clientSchema, clientContactSchema, clientAddressSchema } = require("@schemas/client")

const clientController = {
  findAll: tryCatch(async (req, res) => {
    const clients = await Client.findAll()
    res.status(200).json(clients)
  }),
  create: tryCatch(async (req, res) => {
    const { name, description } = req.body

    clientSchema.parse(req.body)

    const createdByUserId = req.user.id

    await Client.create(name, description, createdByUserId)

    res.status(201).json({ message: "Client created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { clientId } = req.params
    const { name, description } = req.body

    clientSchema.parse(req.body)

    const existingClientId = await Client.findByClientId(clientId)
    if (existingClientId.length <= 0) {
      throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const lastModifiedByUserId = req.user.id

    await Client.update(clientId, name, description, lastModifiedByUserId)
    res.status(204).json({ message: "Client updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { clientId } = req.params

    const existingClientId = await Client.findByClientId(clientId)
    if (existingClientId.length <= 0) {
      throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
    }

    await Client.delete(clientId)
    res.status(204).json({ message: "Client deleted successfully" })
  }),
  createContact: tryCatch(async (req, res) => {
    const { clientId } = req.params
    const { contactType, contact, description } = req.body

    clientContactSchema.parse(req.body)

    const existingClientId = await Client.findByClientId(clientId)
    if (existingClientId.length <= 0) {
      throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const createdByUserId = req.user.id

    await Client.contacts.create(clientId, contactType, contact, description, createdByUserId)
    res.status(201).json({ message: "Contact created successfully" })
  }),
  updateContact: tryCatch(async (req, res) => {
    const { contactId } = req.params
    const { contactType, contact, description } = req.body

    clientContactSchema.parse(req.body)

    const lastModifiedByUserId = req.user.id

    await Client.contacts.update(contactId, contactType, contact, description, lastModifiedByUserId)

    res.status(200).json({ message: "Contact updated successfully" })
  }),
  deleteContact: tryCatch(async (req, res) => {
    const { contactId } = req.params

    await Client.contacts.delete(contactId)

    res.status(204).json({ message: "Contact deleted successfully" })
  }),
  createAddress: tryCatch(async (req, res) => {
    const { clientId } = req.params
    const { country, city, locality, address, postalCode } = req.body

    clientAddressSchema.parse(req.body)

    const createdByUserId = req.user.id

    const newAddress = await Client.addresses.create(
      clientId,
      country,
      city,
      locality,
      address,
      postalCode,
      createdByUserId
    )

    res.status(201).json({ message: "Address created successfully", address: newAddress })
  }),
  updateAddress: tryCatch(async (req, res) => {
    const { addressId } = req.params
    const { country, city, locality, address, postalCode } = req.body

    clientAddressSchema.parse(req.body)

    const lastModifiedByUserId = req.user.id

    await Client.addresses.update(
      addressId,
      country,
      city,
      locality,
      address,
      postalCode,
      lastModifiedByUserId
    )

    res.status(200).json({ message: "Address updated successfully" })
  }),
  deleteAddress: tryCatch(async (req, res) => {
    const { addressId } = req.params

    await Client.addresses.delete(addressId)

    res.status(204).json({ message: "Address deleted successfully" })
  }),
  createInteraction: tryCatch(async (req, res) => {
    const { clientId } = req.params
    const { interactionType, details } = req.body

    const responsibleUserId = req.user.id

    await Client.interactionsHistory.create(clientId, interactionType, details, responsibleUserId)

    res.status(201).json({ message: "Interaction created successfully" })
  })
}

module.exports = clientController
