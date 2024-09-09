const dbQueryExecutor = require("@utils/dbQueryExecutor")

const {
  withCache,
  revalidateCache,
  clearAllCaches,
  multiCache,
  memoryOnlyCache
} = require("@utils/cache")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const { HISTORY_ENABLED } = require("@constants/config")

const Client = {
  findAll: withCache("clients", async () => {
    const Equipment = require("@models/equipment")

    const clientsQuery = `
            SELECT 
              c.id,
              c.name,
              c.description,
              c.created_by_user_id,
              c.created_at_datetime,
              CASE
                WHEN COALESCE(c.last_modified_datetime, c.created_at_datetime) >= COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) 
                    AND COALESCE(c.last_modified_datetime, c.created_at_datetime) >= COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime) 
                THEN c.last_modified_datetime
                WHEN COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) >= COALESCE(c.last_modified_datetime, c.created_at_datetime) 
                    AND COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) >= COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime) 
                THEN MAX(cc.last_modified_datetime)
                ELSE MAX(ca.last_modified_datetime)
              END AS last_modified_datetime,
              CASE
                WHEN COALESCE(c.last_modified_datetime, c.created_at_datetime) >= COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) 
                    AND COALESCE(c.last_modified_datetime, c.created_at_datetime) >= COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime) 
                THEN c.last_modified_by_user_id
                WHEN COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) >= COALESCE(c.last_modified_datetime, c.created_at_datetime) 
                    AND COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) >= COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime) 
                THEN MAX(cc.last_modified_by_user_id)
                ELSE MAX(ca.last_modified_by_user_id)
              END AS last_modified_by_user_id
            FROM clients c
            LEFT JOIN client_contacts cc ON c.id = cc.client_id
            LEFT JOIN client_addresses ca ON c.id = ca.client_id
            GROUP BY c.id, c.name, c.description, c.created_by_user_id, c.created_at_datetime, c.last_modified_datetime, c.last_modified_by_user_id
            ORDER BY 
              CASE
               WHEN COALESCE(c.last_modified_datetime, c.created_at_datetime) >= COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) 
                   AND COALESCE(c.last_modified_datetime, c.created_at_datetime) >= COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime) 
               THEN COALESCE(c.last_modified_datetime, c.created_at_datetime)
               WHEN COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) >= COALESCE(c.last_modified_datetime, c.created_at_datetime) 
                   AND COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime) >= COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime) 
               THEN COALESCE(MAX(cc.last_modified_datetime), MAX(cc.created_at_datetime), c.created_at_datetime)
               ELSE COALESCE(MAX(ca.last_modified_datetime), MAX(ca.created_at_datetime), c.created_at_datetime)
              END DESC,
              c.created_at_datetime DESC
          `
    const clients = await dbQueryExecutor.execute(clientsQuery)

    const clientsWithDetails = await Promise.all(
      clients.map(async (client) => {
        const [
          contacts,
          addresses,
          equipments,
          interactionsHistory,
          createdByUser,
          lastModifiedByUser
        ] = await Promise.all([
          Client.contact.findByClientId(client.id),
          Client.address.findByClientId(client.id),
          Equipment.findByClientId(client.id),
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
          equipments,
          interactions_history: interactionsHistory
        }
      })
    )

    return clientsWithDetails
  }),
  findByClientId: (clientId) =>
    withCache(
      `client:${clientId}`,
      async () => {
        const Equipment = require("@models/equipment")

        const clientQuery = "SELECT  * FROM clients WHERE id = ?"
        const client = await dbQueryExecutor.execute(clientQuery, [clientId])

        if (!client || client.length <= 0) {
          return []
        }

        const [
          contacts,
          addresses,
          equipments,
          interactionsHistory,
          createdByUser,
          lastModifiedByUser
        ] = await Promise.all([
          Client.contact.findByClientId(clientId),
          Client.address.findByClientId(clientId),
          Equipment.findByClientId(clientId),
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
          last_modified_datetime: client[0].last_modified,
          contacts,
          addresses,
          equipments,
          interactions_history: interactionsHistory
        }

        return [clientWithDetails]
      },
      memoryOnlyCache
    )(),
  analytics: {
    getTotal: () => {
      const query = "SELECT COUNT(*) AS total FROM clients"
      return dbQueryExecutor.execute(query)
    },
    getLastSixCompleteMonthsTotal: () => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM clients
          WHERE created_at_datetime >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY month
        ),
        FullMonths AS (
          SELECT
            DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (5 - i) MONTH), '%Y-%m') AS month
          FROM (SELECT 0 i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) numbers
        )
        SELECT 
          f.month,
          COALESCE(m.total, 0) AS total
        FROM FullMonths f
        LEFT JOIN MonthlyTotals m ON f.month = m.month
        ORDER BY f.month
      `
      return dbQueryExecutor.execute(query)
    },
    getLastTwoCompleteMonthsPercentageChange: async () => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM clients
          WHERE created_at_datetime < CURDATE()
          GROUP BY month
        ),
        LastTwoCompleteMonths AS (
          SELECT 
            month, 
            total
          FROM MonthlyTotals
          WHERE month BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m') AND DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
          ORDER BY month DESC
        )
        SELECT 
          COALESCE(
            MAX(CASE WHEN row_num = 1 THEN total END), 0
          ) AS latest_total,
          COALESCE(
            MAX(CASE WHEN row_num = 2 THEN total END), 0
          ) AS previous_total
        FROM (
          SELECT 
            month,
            total,
            ROW_NUMBER() OVER (ORDER BY month DESC) AS row_num
          FROM LastTwoCompleteMonths
        ) AS numbered_totals
      `

      const result = await dbQueryExecutor.execute(query)
      const { latest_total, previous_total } = result[0] || { latest_total: 0, previous_total: 0 }

      if (previous_total === 0) {
        return latest_total === 0 ? 0 : 100
      }

      return ((latest_total - previous_total) / previous_total) * 100
    },
    getTotalsByMonthForYear: async (year) => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(c.created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM clients c
          WHERE YEAR(c.created_at_datetime) = ?
          GROUP BY month
        ),
        FullMonths AS (
          SELECT
            DATE_FORMAT(STR_TO_DATE(CONCAT(?, '-', numbers.i, '-01'), '%Y-%m-%d'), '%Y-%m') AS month
          FROM (SELECT 1 i UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) numbers
        )
        SELECT 
          f.month,
          COALESCE(m.total, 0) AS total
        FROM FullMonths f
        LEFT JOIN MonthlyTotals m ON f.month = m.month
        ORDER BY f.month;
      `

      return dbQueryExecutor.execute(query, [year, year])
    }
  },
  create: (name, description, createdByUserId) => {
    const query =
      "INSERT INTO clients (name, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP())"
    return dbQueryExecutor.execute(query, [name, description, createdByUserId]).then((result) => {
      return revalidateCache("clients").then(() => result)
    })
  },
  update: (clientId, name, description, lastModifiedByUserId) => {
    const query =
      "UPDATE clients SET name = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [name, description, lastModifiedByUserId, clientId])
      .then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
  },
  delete: (clientId) => {
    const query = "DELETE FROM clients WHERE id = ?"
    return dbQueryExecutor.execute(query, [clientId]).then((result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  contact: {
    findByClientId: (clientId) =>
      withCache(
        `client:contacts:${clientId}`,
        async () => {
          const contactsQuery = `
          SELECT *,
                 GREATEST(
                     COALESCE(last_modified_datetime, created_at_datetime),
                     created_at_datetime
                 ) AS last_modified
          FROM client_contacts
          WHERE client_id = ?
          ORDER BY last_modified DESC, created_at_datetime DESC
        `
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
      const params = [
        clientId,
        type,
        type === "Telefone" || type === "Telemóvel"
          ? contact.replace(/\s/g, "")
          : type === "E-mail"
          ? contact.toLowerCase()
          : contact
      ]

      if (contactIdToExclude) {
        query += " AND id != ?"
        params.push(contactIdToExclude)
      }

      return dbQueryExecutor.execute(query, params)
    },
    create: (clientId, type, contact, description, createdByUserId) => {
      const query =
        "INSERT INTO client_contacts (client_id, type, contact, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor
        .execute(query, [
          clientId,
          type,
          type === "Telefone" || type === "Telemóvel"
            ? contact.replace(/\s/g, "")
            : type === "E-mail"
            ? contact.toLowerCase()
            : contact,
          description,
          createdByUserId
        ])
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
        "UPDATE client_contacts SET type = ?, contact = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [
          type,
          type === "Telefone" || type === "Telemóvel"
            ? contact.replace(/\s/g, "")
            : type === "E-mail"
            ? contact.toLowerCase()
            : contact,
          description,
          lastModifiedByUserId,
          contactId
        ])
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
          const addressesQuery = `
          SELECT *,
                 GREATEST(
                     COALESCE(last_modified_datetime, created_at_datetime),
                     created_at_datetime
                 ) AS last_modified
          FROM client_addresses
          WHERE client_id = ?
          ORDER BY last_modified DESC, created_at_datetime DESC
        `
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
        "INSERT INTO client_addresses (client_id, country, city, locality, address, postal_code, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
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
        "UPDATE client_addresses SET country = ?, city = ?, locality = ?, address = ?, postal_code = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
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
                type: interaction.type,
                details: JSON.parse(interaction.details),
                responsible_user:
                  responsibleUser && responsibleUser.length > 0
                    ? mapUser(responsibleUser[0])
                    : null,
                created_at_datetime: interaction.created_at_datetime
              }
            })
          )

          return interactionsWithDetails
        },
        memoryOnlyCache
      )(),
    create: (clientId, interactionType, details, responsibleUserId) => {
      if (HISTORY_ENABLED) {
        const query =
          "INSERT INTO client_interactions_history (client_id, type, details, responsible_user_id, created_at_datetime) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())"
        return dbQueryExecutor
          .execute(query, [clientId, interactionType, details, responsibleUserId])
          .then((result) => {
            return revalidateCache(`client:interactionsHistory:${clientId}`).then(() => result)
          })
      }
    }
  }
}

module.exports = Client
