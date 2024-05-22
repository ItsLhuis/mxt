const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const Client = {
  findAll: withCache("clients", async () => {
    const clientsQuery = "SELECT * FROM clients"
    const clients = await dbQueryExecutor.execute(clientsQuery)

    const clientsWithDetails = await Promise.all(
      clients.map(async (client) => {
        const [contacts, addresses, interactionsHistory, createdByUser, lastModifiedByUser] =
          await Promise.all([
            Client.contact.findByClientId(client.id),
            Client.address.findByClientId(client.id),
            Client.interactionsHistory.findByClientId(client.id),
            User.findByUserId(client.created_by_user_id),
            client.last_modified_by_user_id
              ? User.findByUserId(client.last_modified_by_user_id)
              : Promise.resolve(null)
          ])

        return {
          id: client.id,
          name: client.name,
          description: client.description,
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: client.created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: client.last_modified_datetime,
          contacts,
          addresses,
          interactionsHistory
        }
      })
    )

    return clientsWithDetails
  }),
  findByClientId: (clientId) =>
    withCache(
      `client:${clientId}`,
      async () => {
        const clientQuery = "SELECT * FROM clients WHERE id = ?"
        const client = await dbQueryExecutor.execute(clientQuery, [clientId])

        if (!client || client.length <= 0) {
          return []
        }

        const [contacts, addresses, interactionsHistory, createdByUser, lastModifiedByUser] =
          await Promise.all([
            Client.contact.findByClientId(clientId),
            Client.address.findByClientId(clientId),
            Client.interactionsHistory.findByClientId(clientId),
            User.findByUserId(client[0].created_by_user_id),
            client[0].last_modified_by_user_id
              ? User.findByUserId(client[0].last_modified_by_user_id)
              : Promise.resolve(null)
          ])

        const clientWithDetails = {
          id: client[0].id,
          name: client[0].name,
          description: client[0].description,
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: client[0].created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: client[0].last_modified_datetime,
          contacts,
          addresses,
          interactionsHistory
        }

        return [clientWithDetails]
      },
      memoryOnlyCache
    )(),
  create: (name, description, createdByUserId) => {
    const query =
      "INSERT INTO clients (name, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, NOW())"
    return dbQueryExecutor.execute(query, [name, description, createdByUserId]).then((result) => {
      return revalidateCache("clients").then(() => result)
    })
  },
  update: (clientId, name, description, lastModifiedByUserId) => {
    const query =
      "UPDATE clients SET name = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [name, description, lastModifiedByUserId, clientId])
      .then(() => {
        return revalidateCache(["clients", `client:${clientId}`]).then((result) => result)
      })
  },
  delete: (clientId) => {
    const query = "DELETE FROM clients WHERE id = ?"
    return dbQueryExecutor.execute(query, [clientId]).then((result) => {
      return revalidateCache([
        "clients",
        `client:${clientId}`,
        `client:contacts:${clientId}`,
        `client:addresses:${clientId}`
      ]).then(() => result)
    })
  },
  contact: {
    findByClientId: (clientId) =>
      withCache(
        `client:contacts:${clientId}`,
        async () => {
          const contactsQuery = "SELECT * FROM client_contacts WHERE client_id = ?"
          const contacts = await dbQueryExecutor.execute(contactsQuery, [clientId])

          const contactsWithDetails = await Promise.all(
            contacts.map(async (contact) => {
              const [createdByUser, lastModifiedByUser] = await Promise.all([
                User.findByUserId(contact.created_by_user_id),
                contact.last_modified_by_user_id
                  ? User.findByUserId(contact.last_modified_by_user_id)
                  : Promise.resolve(null)
              ])

              return {
                id: contact.id,
                client_id: contact.client_id,
                type: contact.type,
                contact: contact.contact,
                description: contact.description,
                created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
                created_at_datetime: contact.created_at_datetime,
                last_modified_by_user:
                  lastModifiedByUser && lastModifiedByUser.length > 0
                    ? mapUser(lastModifiedByUser[0])
                    : null,
                last_modified_datetime: contact.last_modified_datetime
              }
            })
          )

          return contactsWithDetails
        },
        memoryOnlyCache
      )(),
    findByContactId: (contactId) => {
      const query = "SELECT * FROM client_contacts WHERE id = ?"
      return dbQueryExecutor.execute(query, [contactId])
    },
    findContactByClientIdAndDetails: (clientId, type, contact, contactIdToExclude) => {
      let query = "SELECT * FROM client_contacts WHERE client_id = ? AND type = ? AND contact = ?"
      const params = [clientId, type, contact]

      if (contactIdToExclude) {
        query += " AND id != ?"
        params.push(contactIdToExclude)
      }

      return dbQueryExecutor.execute(query, params)
    },
    create: (clientId, type, contact, description, createdByUserId) => {
      const query =
        "INSERT INTO client_contacts (client_id, type, contact, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, NOW())"
      return dbQueryExecutor
        .execute(query, [clientId, type, contact, description, createdByUserId])
        .then((result) => {
          return revalidateCache([
            "clients",
            `client:${clientId}`,
            `client:contacts:${clientId}`
          ]).then(() => result)
        })
    },
    update: (clientId, contactId, type, contact, description, lastModifiedByUserId) => {
      const query =
        "UPDATE client_contacts SET type = ?, contact = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [type, contact, description, lastModifiedByUserId, contactId])
        .then((result) => {
          return revalidateCache([
            "clients",
            `client:${clientId}`,
            `client:contacts:${clientId}`
          ]).then(() => result)
        })
    },
    delete: (clientId, contactId) => {
      const query = "DELETE FROM client_contacts WHERE id = ?"
      return dbQueryExecutor.execute(query, [contactId]).then((result) => {
        return revalidateCache([
          "clients",
          `client:${clientId}`,
          `client:contacts:${clientId}`
        ]).then(() => result)
      })
    }
  },
  address: {
    findByClientId: (clientId) =>
      withCache(
        `client:addresses:${clientId}`,
        async () => {
          const addressesQuery = "SELECT * FROM client_addresses WHERE client_id = ?"
          const addresses = await dbQueryExecutor.execute(addressesQuery, [clientId])

          const addressesWithDetails = await Promise.all(
            addresses.map(async (address) => {
              const [createdByUser, lastModifiedByUser] = await Promise.all([
                User.findByUserId(address.created_by_user_id),
                address.last_modified_by_user_id
                  ? User.findByUserId(address.last_modified_by_user_id)
                  : Promise.resolve(null)
              ])

              return {
                id: address.id,
                client_id: address.client_id,
                country: address.country,
                city: address.city,
                locality: address.locality,
                address: address.address,
                postal_code: address.postal_code,
                created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
                created_at_datetime: address.created_at_datetime,
                last_modified_by_user:
                  lastModifiedByUser && lastModifiedByUser.length > 0
                    ? mapUser(lastModifiedByUser[0])
                    : null,
                last_modified_datetime: address.last_modified_datetime
              }
            })
          )

          return addressesWithDetails
        },
        memoryOnlyCache
      )(),
    findByAddressId: (addressId) => {
      const query = "SELECT * FROM client_addresses WHERE id = ?"
      return dbQueryExecutor.execute(query, [addressId])
    },
    findAddressByClientIdAndDetails: (
      clientId,
      country,
      city,
      locality,
      address,
      postalCode,
      addressIdToExclude
    ) => {
      let query =
        "SELECT * FROM client_addresses WHERE client_id = ? AND country = ? AND city = ? AND locality = ? AND address = ? AND postal_code = ?"
      const params = [clientId, country, city, locality, address, postalCode]

      if (addressIdToExclude) {
        query += " AND id != ?"
        params.push(addressIdToExclude)
      }

      return dbQueryExecutor.execute(query, params)
    },
    create: (clientId, country, city, locality, address, postalCode, createdByUserId) => {
      const query =
        "INSERT INTO client_addresses (client_id, country, city, locality, address, postal_code, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
      return dbQueryExecutor
        .execute(query, [clientId, country, city, locality, address, postalCode, createdByUserId])
        .then((result) => {
          return revalidateCache([
            "clients",
            `client:${clientId}`,
            `client:addresses:${clientId}`
          ]).then(() => result)
        })
    },
    update: (
      clientId,
      addressId,
      country,
      city,
      locality,
      address,
      postalCode,
      lastModifiedByUserId
    ) => {
      const query =
        "UPDATE client_addresses SET country = ?, city = ?, locality = ?, address = ?, postal_code = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [
          country,
          city,
          locality,
          address,
          postalCode,
          lastModifiedByUserId,
          addressId
        ])
        .then((result) => {
          return revalidateCache([
            "clients",
            `client:${clientId}`,
            `client:addresses:${clientId}`
          ]).then(() => result)
        })
    },
    delete: (clientId, addressId) => {
      const query = "DELETE FROM client_addresses WHERE id = ?"
      return dbQueryExecutor.execute(query, [addressId]).then((result) => {
        return revalidateCache([
          "clients",
          `client:${clientId}`,
          `client:addresses:${clientId}`
        ]).then(() => result)
      })
    }
  },
  interactionsHistory: {
    findByClientId: (clientId) =>
      withCache(
        `client:interactionsHistory:${clientId}`,
        async () => {
          const query =
            "SELECT * FROM client_interactions_history WHERE client_id = ? ORDER BY created_at_datetime DESC"
          const interactions = await dbQueryExecutor.execute(query, [clientId])

          const interactionsWithDetails = await Promise.all(
            interactions.map(async (interaction) => {
              const responsibleUser = await User.findByUserId(interaction.responsible_user_id)

              return {
                id: interaction.id,
                client_id: interaction.client_id,
                created_at_datetime: interaction.created_at_datetime,
                type: interaction.type,
                details: JSON.parse(interaction.details),
                responsible_user:
                  responsibleUser && responsibleUser.length > 0 ? mapUser(responsibleUser[0]) : null
              }
            })
          )

          return interactionsWithDetails
        },
        memoryOnlyCache
      )(),
    create: (clientId, interactionType, details, responsibleUserId) => {
      const query =
        "INSERT INTO client_interactions_history (client_id, created_at_datetime, type, details, responsible_user_id) VALUES (?, NOW(), ?, ?, ?)"
      return dbQueryExecutor
        .execute(query, [clientId, interactionType, details, responsibleUserId])
        .then((result) => {
          return revalidateCache(`client:interactionsHistory:${clientId}`).then(() => result)
        })
    }
  }
}

module.exports = Client
