const queryExecutor = require("@utils/database/queryExecutor")

const Client = {
  findAll: () => {
    const query = "SELECT * FROM clients"
    return queryExecutor.execute(query)
  },
  findByClientId: (clientId) => {
    const query = "SELECT * FROM clients WHERE id = ?"
    return queryExecutor.execute(query, [clientId])
  },
  create: (name, description, createdByUserId) => {
    const query =
      "INSERT INTO clients (name, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, NOW())"
    return queryExecutor.execute(query, [name, description, createdByUserId])
  },
  update: (clientId, name, description, lastModifiedByUserId) => {
    const query =
      "UPDATE clients SET name = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
    return queryExecutor.execute(query, [name, description, lastModifiedByUserId, clientId])
  },
  delete: (clientId) => {
    const query = "DELETE FROM clients WHERE id = ?"
    return queryExecutor.execute(query, [clientId])
  },
  contact: {
    findByClientId: (clientId) => {
      const query = "SELECT * FROM client_contacts WHERE client_id = ?"
      return queryExecutor.execute(query, [clientId])
    },
    findByContactId: (contactId) => {
      const query = "SELECT * FROM client_contacts WHERE id = ?"
      return queryExecutor.execute(query, [contactId])
    },
    findContactByClientIdAndDetails: (clientId, contactType, contact, contactIdToExclude) => {
      let query =
        "SELECT * FROM client_contacts WHERE client_id = ? AND contact_type = ? AND contact = ?"
      const params = [clientId, contactType, contact]

      if (contactIdToExclude) {
        query += " AND id != ?"
        params.push(contactIdToExclude)
      }

      return queryExecutor.execute(query, params)
    },
    create: (clientId, contactType, contact, description, createdByUserId) => {
      const query =
        "INSERT INTO client_contacts (client_id, contact_type, contact, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, NOW())"
      return queryExecutor.execute(query, [
        clientId,
        contactType,
        contact,
        description,
        createdByUserId
      ])
    },
    update: (contactId, contactType, contact, description, lastModifiedByUserId) => {
      const query =
        "UPDATE client_contacts SET contact_type = ?, contact = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return queryExecutor.execute(query, [
        contactType,
        contact,
        description,
        lastModifiedByUserId,
        contactId
      ])
    },
    delete: (contactId) => {
      const query = "DELETE FROM client_contacts WHERE id = ?"
      return queryExecutor.execute(query, [contactId])
    }
  },
  address: {
    findByClientId: (clientId) => {
      const query = "SELECT * FROM client_addresses WHERE client_id = ?"
      return queryExecutor.execute(query, [clientId])
    },
    findByAddressId: (addressId) => {
      const query = "SELECT * FROM client_addresses WHERE id = ?"
      return queryExecutor.execute(query, [addressId])
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

      return queryExecutor.execute(query, params)
    },
    create: (clientId, country, city, locality, address, postalCode, createdByUserId) => {
      const query =
        "INSERT INTO client_addresses (client_id, country, city, locality, address, postal_code, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
      return queryExecutor.execute(query, [
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
      return queryExecutor.execute(query, [
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
      return queryExecutor.execute(query, [addressId])
    }
  },
  interactionsHistory: {
    findByClientId: (clientId) => {
      const query = "SELECT * FROM client_interactions_history WHERE client_id = ?"
      return queryExecutor.execute(query, [clientId])
    },
    create: (clientId, interactionType, details, responsibleUserId) => {
      const query =
        "INSERT INTO client_interactions_history (client_id, interaction_datetime, interaction_type, details, responsible_user_id) VALUES (?, NOW(), ?, ?, ?)"
      return queryExecutor.execute(query, [clientId, interactionType, details, responsibleUserId])
    }
  }
}

module.exports = Client
