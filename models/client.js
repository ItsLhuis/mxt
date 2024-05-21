const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Client = {
  findAll: withCache("clients", async () => {
    const clientsQuery = "SELECT * FROM clients"
    const clients = await dbQueryExecutor.execute(clientsQuery)

    const clientsWithDetails = await Promise.all(
      clients.map(async (client) => {
        const contacts = await Client.contact.findByClientId(client.id)
        const addresses = await Client.address.findByClientId(client.id)
        const interactionsHistory = await Client.interactionsHistory.findByClientId(client.id)

        return { ...client, contacts, addresses, interactionsHistory }
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

        const clientWithDetails = { ...client[0] }

        const [contacts, addresses, interactionsHistory] = await Promise.all([
          Client.contact.findByClientId(clientId),
          Client.address.findByClientId(clientId),
          Client.interactionsHistory.findByClientId(clientId)
        ])

        clientWithDetails.contacts = contacts
        clientWithDetails.addresses = addresses
        clientWithDetails.interactionsHistory = interactionsHistory

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
          const query = "SELECT * FROM client_contacts WHERE client_id = ?"
          return dbQueryExecutor.execute(query, [clientId])
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
          const query = "SELECT * FROM client_addresses WHERE client_id = ?"
          return dbQueryExecutor.execute(query, [clientId])
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
            "SELECT * FROM client_interactions_history WHERE client_id = ? ORDER BY created_at_datetime ASC"
          return dbQueryExecutor.execute(query, [clientId])
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
