const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache } = require("@utils/cache")

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
  findByClientId: (clientId) => {
    const query = "SELECT * FROM clients WHERE id = ?"
    return dbQueryExecutor.execute(query, [clientId])
  },
  create: (name, description, createdByUserId) => {
    const query =
      "INSERT INTO clients (name, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, NOW())"
    return dbQueryExecutor.execute(query, [name, description, createdByUserId])
  },
  update: (clientId, name, description, lastModifiedByUserId) => {
    const query =
      "UPDATE clients SET name = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
    return dbQueryExecutor.execute(query, [name, description, lastModifiedByUserId, clientId])
  },
  delete: (clientId) => {
    const query = "DELETE FROM clients WHERE id = ?"
    return dbQueryExecutor.execute(query, [clientId])
  },
  contact: {
    findByClientId: (clientId) => {
      const query = "SELECT * FROM client_contacts WHERE client_id = ?"
      return dbQueryExecutor.execute(query, [clientId])
    },
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
      return dbQueryExecutor.execute(query, [clientId, type, contact, description, createdByUserId])
    },
    update: (contactId, type, contact, description, lastModifiedByUserId) => {
      const query =
        "UPDATE client_contacts SET type = ?, contact = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor.execute(query, [
        type,
        contact,
        description,
        lastModifiedByUserId,
        contactId
      ])
    },
    delete: (contactId) => {
      const query = "DELETE FROM client_contacts WHERE id = ?"
      return dbQueryExecutor.execute(query, [contactId])
    }
  },
  address: {
    findByClientId: (clientId) => {
      const query = "SELECT * FROM client_addresses WHERE client_id = ?"
      return dbQueryExecutor.execute(query, [clientId])
    },
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
      return dbQueryExecutor.execute(query, [
        clientId,
        country,
        city,
        locality,
        address,
        postalCode,
        createdByUserId
      ])
    },
    update: (addressId, country, city, locality, address, postalCode, lastModifiedByUserId) => {
      const query =
        "UPDATE client_addresses SET country = ?, city = ?, locality = ?, address = ?, postal_code = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor.execute(query, [
        country,
        city,
        locality,
        address,
        postalCode,
        lastModifiedByUserId,
        addressId
      ])
    },
    delete: (addressId) => {
      const query = "DELETE FROM client_addresses WHERE id = ?"
      return dbQueryExecutor.execute(query, [addressId])
    }
  },
  interactionsHistory: {
    findByClientId: (clientId) => {
      const query = "SELECT * FROM client_interactions_history WHERE client_id = ?"
      return dbQueryExecutor.execute(query, [clientId])
    },
    create: (clientId, interactionType, details, responsibleUserId) => {
      const query =
        "INSERT INTO client_interactions_history (client_id, interaction_datetime, interaction_type, details, responsible_user_id) VALUES (?, NOW(), ?, ?, ?)"
      return dbQueryExecutor.execute(query, [clientId, interactionType, details, responsibleUserId])
    }
  }
}

module.exports = Client
