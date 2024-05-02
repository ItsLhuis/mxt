const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const {
  CLIENT_NOT_FOUND,
  DUPLICATE_CONTACT,
  CONTACT_NOT_FOUND,
  DUPLICATE_ADDRESS,
  ADDRESS_NOT_FOUND
} = require("@constants/errors/client")

const clientInteractions = {
  CLIENT_UPDATED: "Cliente Atualizado",
  CONTACT_UPDATED: "Contacto Atualizado",
  ADDRESS_UPDATED: "Morada Atualizada"
}

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

    await Client.create(name, description, req.user.id)
    res.status(201).json({ message: "Client created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { clientId } = req.params
    const { name, description } = req.body

    clientSchema.parse(req.body)

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
    }

    await Client.update(clientId, name, description, req.user.id)

    /*     const changes = [
      { field: "Name", before: oldClientDetails.name, after: clientUpdated.name, changed: oldClientDetails.name !== newClientDetails.name },
      { field: "Description", before: oldClientDetails.description, after: newClientDetails.description, changed: oldClientDetails.description !== newClientDetails.description }
    ]; */

    /*     await createInteractionHistory(
      existingClient[0].id,
      CLIENT_UPDATED,
      JSON.stringify(existingClient[0]),
      req.user.id
    ) */
    res.status(204).json({ message: "Client updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { clientId } = req.params

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
    }

    await Client.delete(clientId)
    res.status(204).json({ message: "Client deleted successfully" })
  }),
  contact: {
    findAllByClientId: tryCatch(async (req, res) => {
      const { clientId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const contacts = await Client.contact.findByClientId(clientId)
      res.status(200).json(contacts)
    }),
    create: tryCatch(async (req, res) => {
      const { clientId } = req.params
      const { contactType, contact, description } = req.body

      clientContactSchema.parse(req.body)

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const duplicateContact = await Client.contact.findContactByClientIdAndDetails(
        clientId,
        contactType,
        contact,
        null
      )
      if (duplicateContact.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_CONTACT,
          "A contact with the same type and value already exists for this client",
          true
        )
      }

      await Client.contact.create(clientId, contactType, contact, description, req.user.id)
      res.status(201).json({ message: "Contact created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { contactId } = req.params
      const { contactType, contact, description } = req.body

      clientContactSchema.parse(req.body)

      const existingContact = await Client.contact.findByContactId(contactId)
      if (existingContact.length <= 0) {
        throw new AppError(400, CONTACT_NOT_FOUND, "Contact not found", true)
      }

      const duplicateContact = await Client.contact.findContactByClientIdAndDetails(
        existingContact[0].client_id,
        contactType,
        contact,
        contactId
      )
      if (duplicateContact.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_CONTACT,
          "A contact with the same type and value already exists for this client",
          true
        )
      }

      await Client.contact.update(contactId, contactType, contact, description, req.user.id)
      res.status(200).json({ message: "Contact updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { contactId } = req.params

      const existingContact = await Client.contact.findByContactId(contactId)
      if (existingContact.length <= 0) {
        throw new AppError(400, CONTACT_NOT_FOUND, "Contact not found", true)
      }

      await Client.contact.delete(contactId)
      res.status(204).json({ message: "Contact deleted successfully" })
    })
  },
  address: {
    findAllByClientId: tryCatch(async (req, res) => {
      const { clientId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const addresses = await Client.address.findByClientId(clientId)
      res.status(200).json(addresses)
    }),
    create: tryCatch(async (req, res) => {
      const { clientId } = req.params
      const { country, city, locality, address, postalCode } = req.body

      clientAddressSchema.parse(req.body)

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const duplicateAddress = await Client.address.findAddressByClientIdAndDetails(
        clientId,
        country,
        city,
        locality,
        address,
        postalCode,
        null
      )
      if (duplicateAddress.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_ADDRESS,
          "An address with the same details already exists for this client",
          true
        )
      }

      await Client.address.create(
        clientId,
        country,
        city,
        locality,
        address,
        postalCode,
        req.user.id
      )
      res.status(201).json({ message: "Address created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { addressId } = req.params
      const { country, city, locality, address, postalCode } = req.body

      clientAddressSchema.parse(req.body)

      const existingAddress = await Client.address.findByAddressId(addressId)
      if (existingAddress.length <= 0) {
        throw new AppError(400, ADDRESS_NOT_FOUND, "Address not found", true)
      }

      const duplicateAddress = await Client.address.findAddressByClientIdAndDetails(
        existingAddress[0].client_id,
        country,
        city,
        locality,
        address,
        postalCode,
        addressId
      )
      if (duplicateAddress.length > 0) {
        throw new AppError(
          400,
          DUPLICATE_ADDRESS,
          "An address with the same details already exists for another client",
          true
        )
      }

      await Client.address.update(
        addressId,
        country,
        city,
        locality,
        address,
        postalCode,
        req.user.id
      )
      res.status(200).json({ message: "Address updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { addressId } = req.params

      const existingAddress = await Client.address.findByAddressId(addressId)
      if (existingAddress.length <= 0) {
        throw new AppError(400, ADDRESS_NOT_FOUND, "Address not found", true)
      }

      await Client.address.delete(addressId)
      res.status(204).json({ message: "Address deleted successfully" })
    })
  },
  interactionsHistory: {
    findAllByClientId: tryCatch(async (req, res) => {
      const { clientId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const interactionsHistory = await Client.interactionsHistory.findByClientId(clientId)
      res.status(200).json(interactionsHistory)
    })
  }
}

const createInteractionHistory = async (clientId, interactionType, changes, userId) => {
  await Client.interactionsHistory.create(
    clientId,
    interactionType,
    JSON.stringify(changes),
    userId
  )
}

module.exports = clientController
