const { produce } = require("immer")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const {
  CLIENT_NOT_FOUND,
  DUPLICATE_CONTACT,
  CONTACT_NOT_FOUND,
  DUPLICATE_ADDRESS,
  ADDRESS_NOT_FOUND
} = require("@constants/errors/client")

const {
  CLIENT_CREATED,
  CLIENT_UPDATED,
  CONTACT_CREATED,
  CONTACT_UPDATED,
  CONTACT_DELETED,
  ADDRESS_CREATED,
  ADDRESS_UPDATED,
  ADDRESS_DELETED
} = require("@constants/interactions/client")

const roles = require("@constants/roles")

const Client = require("@models/client")
const { clientSchema, clientContactSchema, clientAddressSchema } = require("@schemas/client")

const clientController = {
  findAll: tryCatch(async (req, res) => {
    const clients = await Client.findAll()

    const includeInteractionsHistory = req.user.role !== roles.EMPLOYEE

    const filteredClients = produce(clients, (draft) => {
      if (!includeInteractionsHistory) {
        draft.forEach((client) => {
          delete client.interactionsHistory
        })
      }
    })

    res.status(200).json(filteredClients)
  }),
  findByClientId: tryCatch(async (req, res) => {
    const { clientId } = req.params

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const includeInteractionsHistory = req.user.role !== roles.EMPLOYEE

    const filteredClient = produce(existingClient[0], (draft) => {
      if (!includeInteractionsHistory) {
        delete draft.interactionsHistory
      }
    })

    res.status(200).json([filteredClient])
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
  }),
  update: tryCatch(async (req, res) => {
    const { clientId } = req.params
    const { name, description } = req.body

    clientSchema.parse(req.body)

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
    }

    await Client.update(clientId, name, description, req.user.id)

    const changes = [
      {
        field: "Nome",
        before: existingClient[0].name,
        after: name,
        changed: existingClient[0].name !== name
      },
      {
        field: "Descrição",
        before: existingClient[0].description,
        after: !description ? null : description,
        changed: existingClient[0].description !== description
      }
    ]

    await createInteractionHistory(existingClient[0].id, CLIENT_UPDATED, changes, req.user.id)
    res.status(204).json({ message: "Client updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { clientId } = req.params

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
    }

    await Client.delete(clientId)
    res.status(204).json({ message: "Client deleted successfully" })
  }),
  contact: {
    findAllByClientId: tryCatch(async (req, res) => {
      const { clientId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const contacts = await Client.contact.findByClientId(clientId)
      res.status(200).json(contacts)
    }),
    create: tryCatch(async (req, res) => {
      const { clientId } = req.params
      const { type, contact, description } = req.body

      clientContactSchema.parse(req.body)

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const duplicateContact = await Client.contact.findContactByClientIdAndDetails(
        clientId,
        type,
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

      await Client.contact.create(clientId, type, contact, description, req.user.id)

      const changes = [
        { field: "Tipo", after: type },
        {
          field: "Contacto",
          after: type === "Telefone" || type === "Telemóvel" ? contact.replace(/\s/g, "") : contact
        },
        { field: "Descrição", after: !description ? null : description }
      ]

      await createInteractionHistory(clientId, CONTACT_CREATED, changes, req.user.id)
      res.status(201).json({ message: "Contact created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { clientId, contactId } = req.params
      const { type, contact, description } = req.body

      clientContactSchema.parse(req.body)

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const existingContact = await Client.contact.findByContactId(contactId)
      if (existingContact.length <= 0) {
        throw new AppError(404, CONTACT_NOT_FOUND, "Contact not found", true)
      }

      if (existingContact[0].client_id !== Number(clientId)) {
        throw new AppError(404, CONTACT_NOT_FOUND, "Contact not found", true)
      }

      const duplicateContact = await Client.contact.findContactByClientIdAndDetails(
        existingContact[0].client_id,
        type,
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

      await Client.contact.update(clientId, contactId, type, contact, description, req.user.id)

      const changes = [
        {
          field: "Tipo",
          before: existingContact[0].type,
          after: type,
          changed: existingContact[0].type !== type
        },
        {
          field: "Contacto",
          before: existingContact[0].contact,
          after: type === "Telefone" || type === "Telemóvel" ? contact.replace(/\s/g, "") : contact,
          changed: existingContact[0].contact !== contact
        },
        {
          field: "Descrição",
          before: existingContact[0].description,
          after: !description ? null : description,
          changed: existingContact[0].description !== description
        }
      ]

      await createInteractionHistory(
        existingContact[0].client_id,
        CONTACT_UPDATED,
        changes,
        req.user.id
      )
      res.status(200).json({ message: "Contact updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { clientId, contactId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const existingContact = await Client.contact.findByContactId(contactId)
      if (existingContact.length <= 0) {
        throw new AppError(404, CONTACT_NOT_FOUND, "Contact not found", true)
      }

      if (existingContact[0].client_id !== clientId) {
        throw new AppError(404, CONTACT_NOT_FOUND, "Contact not found", true)
      }

      await Client.contact.delete(clientId, contactId)

      const changes = [
        {
          field: "Tipo",
          before: existingContact[0].type
        },
        {
          field: "Contacto",
          before: existingContact[0].contact
        },
        {
          field: "Descrição",
          before: existingContact[0].description
        }
      ]

      await createInteractionHistory(
        existingContact[0].client_id,
        CONTACT_DELETED,
        changes,
        req.user.id
      )
      res.status(204).json({ message: "Contact deleted successfully" })
    })
  },
  address: {
    findAllByClientId: tryCatch(async (req, res) => {
      const { clientId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
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
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
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

      const changes = [
        { field: "País", after: country },
        { field: "Cidade", after: city },
        { field: "Localidade", after: locality },
        { field: "Morada", after: address },
        { field: "Código Postal", after: postalCode }
      ]

      await createInteractionHistory(clientId, ADDRESS_CREATED, changes, req.user.id)
      res.status(201).json({ message: "Address created successfully" })
    }),
    update: tryCatch(async (req, res) => {
      const { clientId, addressId } = req.params
      const { country, city, locality, address, postalCode } = req.body

      clientAddressSchema.parse(req.body)

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const existingAddress = await Client.address.findByAddressId(addressId)
      if (existingAddress.length <= 0) {
        throw new AppError(404, ADDRESS_NOT_FOUND, "Address not found", true)
      }

      if (existingAddress[0].client_id !== Number(clientId)) {
        throw new AppError(404, CONTACT_NOT_FOUND, "Address not found", true)
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
          "An address with the same details already exists for this client",
          true
        )
      }

      await Client.address.update(
        clientId,
        addressId,
        country,
        city,
        locality,
        address,
        postalCode,
        req.user.id
      )

      const changes = [
        {
          field: "País",
          before: existingAddress[0].country,
          after: !country ? null : country,
          changed: existingAddress[0].country !== country
        },
        {
          field: "Cidade",
          before: existingAddress[0].city,
          after: !city ? null : city,
          changed: existingAddress[0].city !== city
        },
        {
          field: "Localidade",
          before: existingAddress[0].locality,
          after: !locality ? null : locality,
          changed: existingAddress[0].locality !== locality
        },
        {
          field: "Morada",
          before: existingAddress[0].address,
          after: !address ? null : address,
          changed: existingAddress[0].address !== address
        },
        {
          field: "Código Postal",
          before: existingAddress[0].postal_code,
          after: !postalCode ? null : postalCode,
          changed: existingAddress[0].postal_code !== postalCode
        }
      ]

      await createInteractionHistory(
        existingAddress[0].client_id,
        ADDRESS_UPDATED,
        changes,
        req.user.id
      )
      res.status(200).json({ message: "Address updated successfully" })
    }),
    delete: tryCatch(async (req, res) => {
      const { clientId, addressId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
      }

      const existingAddress = await Client.address.findByAddressId(addressId)
      if (existingAddress.length <= 0) {
        throw new AppError(404, ADDRESS_NOT_FOUND, "Address not found", true)
      }

      await Client.address.delete(clientId, addressId)

      const changes = [
        {
          field: "País",
          before: existingAddress[0].country
        },
        {
          field: "Cidade",
          before: existingAddress[0].city
        },
        {
          field: "Localidade",
          before: existingAddress[0].locality
        },
        {
          field: "Morada",
          before: existingAddress[0].address
        },
        {
          field: "Código Postal",
          before: existingAddress[0].postal_code
        }
      ]

      await createInteractionHistory(
        existingAddress[0].client_id,
        ADDRESS_DELETED,
        changes,
        req.user.id
      )
      res.status(204).json({ message: "Address deleted successfully" })
    })
  },
  interactionsHistory: {
    findAllByClientId: tryCatch(async (req, res) => {
      const { clientId } = req.params

      const existingClient = await Client.findByClientId(clientId)
      if (existingClient.length <= 0) {
        throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
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
