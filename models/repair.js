const dbQueryExecutor = require("@utils/dbQueryExecutor")

const {
  withCache,
  revalidateCache,
  clearAllCaches,
  multiCache,
  memoryOnlyCache,
  diskOnlyCache
} = require("@utils/cache")

const Equipment = require("@models/equipment")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const { HISTORY_ENABLED } = require("@constants/config")

const Repair = {
  findAll: withCache("repairs", async () => {
    const repairsQuery =
      "SELECT * FROM repairs ORDER BY COALESCE(last_modified_datetime, created_at_datetime) DESC"
    const repairs = await dbQueryExecutor.execute(repairsQuery)

    const repairsWithDetails = await Promise.all(
      repairs.map(async (repair) => {
        const [
          equipment,
          status,
          createdByUser,
          lastModifiedByUser,
          entryAccessories,
          entryReportedIssues,
          interventionWorksDone,
          interventionAccessoriesUsed,
          interactionsHistory,
          attachments
        ] = await Promise.all([
          Equipment.findByEquipmentId(repair.equipment_id),
          Repair.status.findByStatusId(repair.status_id),
          User.findByUserId(repair.created_by_user_id),
          repair.last_modified_by_user_id
            ? User.findByUserId(repair.last_modified_by_user_id)
            : Promise.resolve(null),
          Repair.findEntryAccessoriesByRepairId(repair.id),
          Repair.findEntryReportedIssuesByRepairId(repair.id),
          Repair.findInterventionWorksDoneByRepairId(repair.id),
          Repair.findInterventionAccessoriesUsedByRepairId(repair.id),
          Repair.interactionsHistory.findByRepairId(repair.id),
          Repair.attachment.findAllByRepairId(repair.id)
        ])

        return {
          id: repair.id,
          equipment: {
            id: equipment[0].id,
            client: equipment[0].client,
            brand: equipment[0].brand,
            model: equipment[0].model,
            type: equipment[0].type,
            sn: equipment[0].sn,
            description: equipment[0].description
          },
          status: {
            id: status[0].id,
            name: status[0].name,
            color: status[0].color
          },
          entry_accessories: entryAccessories,
          entry_accessories_description: repair.entry_accessories_description,
          entry_reported_issues: entryReportedIssues,
          entry_reported_issues_description: repair.entry_reported_issues_description,
          entry_description: repair.entry_description,
          entry_datetime: repair.entry_datetime,
          intervention_works_done: interventionWorksDone,
          intervention_works_done_description: repair.intervention_works_done_description,
          intervention_accessories_used: interventionAccessoriesUsed,
          intervention_accessories_used_description:
            repair.intervention_accessories_used_description,
          intervention_description: repair.intervention_description,
          conclusion_datetime: repair.conclusion_datetime,
          delivery_datetime: repair.delivery_datetime,
          is_client_notified: Boolean(repair.is_client_notified),
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: repair.created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: repair.last_modified_datetime,
          attachments,
          interactions_history: interactionsHistory
        }
      })
    )

    return repairsWithDetails
  }),
  findByRepairId: (repairId) =>
    withCache(
      `repair:${repairId}`,
      async () => {
        const repairQuery = "SELECT * FROM repairs WHERE id = ?"
        const repair = await dbQueryExecutor.execute(repairQuery, [repairId])

        if (!repair || repair.length <= 0) {
          return []
        }

        const [
          equipment,
          status,
          createdByUser,
          lastModifiedByUser,
          entryAccessories,
          entryReportedIssues,
          interventionWorksDone,
          interventionAccessoriesUsed,
          interactionsHistory,
          attachments
        ] = await Promise.all([
          Equipment.findByEquipmentId(repair[0].equipment_id),
          Repair.status.findByStatusId(repair[0].status_id),
          User.findByUserId(repair[0].created_by_user_id),
          repair[0].last_modified_by_user_id
            ? User.findByUserId(repair.last_modified_by_user_id)
            : Promise.resolve(null),
          Repair.findEntryAccessoriesByRepairId(repair[0].id),
          Repair.findEntryReportedIssuesByRepairId(repair[0].id),
          Repair.findInterventionWorksDoneByRepairId(repair[0].id),
          Repair.findInterventionAccessoriesUsedByRepairId(repair[0].id),
          Repair.interactionsHistory.findByRepairId(repair[0].id),
          Repair.attachment.findAllByRepairId(repair[0].id)
        ])

        const repairWithDetails = {
          id: repair[0].id,
          equipment: {
            id: equipment[0].id,
            client: equipment[0].client,
            brand: equipment[0].brand,
            model: equipment[0].model,
            type: equipment[0].type,
            sn: equipment[0].sn,
            description: equipment[0].description
          },
          status: {
            id: status[0].id,
            name: status[0].name,
            color: status[0].color
          },
          entry_accessories: entryAccessories,
          entry_accessories_description: repair[0].entry_accessories_description,
          entry_reported_issues: entryReportedIssues,
          entry_reported_issues_description: repair[0].entry_reported_issues_description,
          entry_description: repair[0].entry_description,
          entry_datetime: repair[0].entry_datetime,
          intervention_works_done: interventionWorksDone,
          intervention_works_done_description: repair[0].intervention_works_done_description,
          intervention_accessories_used: interventionAccessoriesUsed,
          intervention_accessories_used_description:
            repair[0].intervention_accessories_used_description,
          intervention_description: repair[0].intervention_description,
          conclusion_datetime: repair[0].conclusion_datetime,
          delivery_datetime: repair[0].delivery_datetime,
          is_client_notified: Boolean(repair[0].is_client_notified),
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: repair[0].created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: repair[0].last_modified_datetime,
          attachments,
          interactions_history: interactionsHistory
        }

        return [repairWithDetails]
      },
      memoryOnlyCache
    )(),
  findByEquipmentId: (equipmentId) =>
    withCache(
      `repairs:equipment:${equipmentId}`,
      async () => {
        const repairsQuery =
          "SELECT * FROM repairs WHERE equipment_id = ? ORDER BY COALESCE(last_modified_datetime, created_at_datetime) DESC"
        const repairs = await dbQueryExecutor.execute(repairsQuery, [equipmentId])

        const repairsWithDetails = await Promise.all(
          repairs.map(async (repair) => {
            const [status, createdByUser, lastModifiedByUser] = await Promise.all([
              Repair.status.findByStatusId(repair.status_id),
              User.findByUserId(repair.created_by_user_id),
              repair.last_modified_by_user_id
                ? User.findByUserId(repair.last_modified_by_user_id)
                : Promise.resolve(null)
            ])

            return {
              id: repair.id,
              status: {
                id: status[0].id,
                name: status[0].name,
                color: status[0].color
              },
              entry_datetime: repair.entry_datetime,
              conclusion_datetime: repair.conclusion_datetime,
              delivery_datetime: repair.delivery_datetime,
              is_client_notified: Boolean(repair.is_client_notified),
              created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
              created_at_datetime: repair.created_at_datetime,
              last_modified_by_user:
                lastModifiedByUser && lastModifiedByUser.length > 0
                  ? mapUser(lastModifiedByUser[0])
                  : null,
              last_modified_datetime: repair.last_modified_datetime
            }
          })
        )

        return repairsWithDetails
      },
      memoryOnlyCache
    )(),
  create: (equipmentId, statusId, entryDescription, entryDatetime, createdByUserId) => {
    const query = `
    INSERT INTO repairs (
      equipment_id, 
      status_id,
      entry_description, 
      entry_datetime, 
      created_by_user_id, 
      created_at_datetime
    ) VALUES (
      ?, ?, ?, ?, ?, CURRENT_TIMESTAMP()
    )`
    return dbQueryExecutor
      .execute(query, [equipmentId, statusId, entryDescription, entryDatetime, createdByUserId])
      .then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
  },
  update: (
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
    lastModifiedByUserId,
    entryAccessoriesIds,
    entryReportedIssuesIds,
    interventionWorksDoneIds,
    interventionAccessoriesUsedIds
  ) => {
    return new Promise(async (resolve, reject) => {
      let transaction

      try {
        transaction = await dbQueryExecutor.startTransaction()

        const updateRepairQuery = `
        UPDATE repairs
        SET 
          status_id = ?,
          entry_accessories_description = ?,
          entry_reported_issues_description = ?,
          entry_description = ?,
          entry_datetime = ?,
          intervention_works_done_description = ?,
          intervention_accessories_used_description = ?,
          intervention_description = ?,
          conclusion_datetime = ?,
          delivery_datetime = ?,
          is_client_notified = ?,
          last_modified_by_user_id = ?,
          last_modified_datetime = CURRENT_TIMESTAMP()
        WHERE id = ?`
        const result = await dbQueryExecutor.execute(
          updateRepairQuery,
          [
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
            lastModifiedByUserId,
            repairId
          ],
          transaction
        )

        const optionsMap = {
          entryAccessoriesIds: {
            table: "repair_entry_accessories",
            column: "accessory_option_id",
            ids: entryAccessoriesIds
          },
          entryReportedIssuesIds: {
            table: "repair_entry_reported_issues",
            column: "reported_issue_option_id",
            ids: entryReportedIssuesIds
          },
          interventionWorksDoneIds: {
            table: "repair_intervention_works_done",
            column: "work_done_option_id",
            ids: interventionWorksDoneIds
          },
          interventionAccessoriesUsedIds: {
            table: "repair_intervention_accessories_used",
            column: "accessories_used_option_id",
            ids: interventionAccessoriesUsedIds
          }
        }

        for (const [_, optionData] of Object.entries(optionsMap)) {
          const deleteOptionsQuery = `DELETE FROM ${optionData.table} WHERE repair_id = ?`
          await dbQueryExecutor.execute(deleteOptionsQuery, [repairId], transaction)

          if (optionData.ids && optionData.ids.length > 0) {
            const insertOptionsQuery = `INSERT INTO ${optionData.table} (repair_id, ${optionData.column}) VALUES (?, ?)`
            const insertPromises = optionData.ids.map((optionId) => {
              return dbQueryExecutor.execute(insertOptionsQuery, [repairId, optionId], transaction)
            })
            await Promise.all(insertPromises)
          }
        }

        await dbQueryExecutor.commitTransaction(transaction)

        await clearAllCaches([multiCache, memoryOnlyCache])
        resolve(result)
      } catch (error) {
        if (transaction) {
          await dbQueryExecutor.rollbackTransaction(transaction)
        }
        reject(error)
      }
    })
  },
  delete: (repairId) => {
    const query = "DELETE FROM repairs WHERE id = ?"
    return dbQueryExecutor.execute(query, [repairId]).then((result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  findByStatusId: async (statusId) => {
    const query = "SELECT * FROM repairs WHERE status_id = ?"
    return dbQueryExecutor.execute(query, [statusId])
  },
  findByEntryAccessoryId: async (entryAccessoryId) => {
    const query = `
    SELECT r.*
    FROM repairs r
    INNER JOIN repair_entry_accessories rea ON r.id = rea.repair_id
    WHERE rea.accessory_option_id = ?`
    return dbQueryExecutor.execute(query, [entryAccessoryId])
  },
  findByEntryReportedIssueId: async (entryReportedIssueId) => {
    const query = `
    SELECT r.*
    FROM repairs r
    INNER JOIN repair_entry_reported_issues reri ON r.id = reri.repair_id
    WHERE reri.reported_issue_option_id = ?`
    return dbQueryExecutor.execute(query, [entryReportedIssueId])
  },
  findByInterventionWorkDoneId: async (interventionWorkDoneId) => {
    const query = `
    SELECT r.*
    FROM repairs r
    INNER JOIN repair_intervention_works_done riwd ON r.id = riwd.repair_id
    WHERE riwd.work_done_option_id = ?`
    return dbQueryExecutor.execute(query, [interventionWorkDoneId])
  },
  findByInterventionAccessoryUsedId: async (interventionAccessoryUsedId) => {
    const query = `
    SELECT r.*
    FROM repairs r
    INNER JOIN repair_intervention_accessories_used riau ON r.id = riau.repair_id
    WHERE riau.accessories_used_option_id = ?`
    return dbQueryExecutor.execute(query, [interventionAccessoryUsedId])
  },
  findEntryAccessoriesByRepairId: async (repairId) => {
    const query = `
    SELECT ro.id, ro.name
    FROM repair_entry_accessories rea
    INNER JOIN repair_entry_accessories_options ro ON rea.accessory_option_id = ro.id
    WHERE rea.repair_id = ?`
    return dbQueryExecutor.execute(query, [repairId])
  },
  findEntryReportedIssuesByRepairId: async (repairId) => {
    const query = `
    SELECT rio.id, rio.name
    FROM repair_entry_reported_issues rei
    INNER JOIN repair_entry_reported_issues_options rio ON rei.reported_issue_option_id = rio.id
    WHERE rei.repair_id = ?`
    return dbQueryExecutor.execute(query, [repairId])
  },
  findInterventionWorksDoneByRepairId: async (repairId) => {
    const query = `
    SELECT wdo.id, wdo.name
    FROM repair_intervention_works_done riw
    INNER JOIN repair_intervention_works_done_options wdo ON riw.work_done_option_id = wdo.id
    WHERE riw.repair_id = ?`
    return dbQueryExecutor.execute(query, [repairId])
  },
  findInterventionAccessoriesUsedByRepairId: async (repairId) => {
    const query = `
    SELECT auo.id, auo.name
    FROM repair_intervention_accessories_used ria
    INNER JOIN repair_intervention_accessories_used_options auo ON ria.accessories_used_option_id = auo.id
    WHERE ria.repair_id = ?`
    return dbQueryExecutor.execute(query, [repairId])
  },
  status: {
    findAll: withCache("repair:status", async () => {
      const statusQuery = "SELECT * FROM repair_status ORDER BY name"
      const status = await dbQueryExecutor.execute(statusQuery)

      const statusWithDetails = await Promise.all(
        status.map(async (status) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(status.created_by_user_id),
            status.last_modified_by_user_id
              ? User.findByUserId(status.last_modified_by_user_id)
              : null
          ])

          return {
            id: status.id,
            name: status.name,
            color: status.color,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: status.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: status.last_modified_datetime
          }
        })
      )

      return statusWithDetails
    }),
    findByStatusId: (statusId) =>
      withCache(
        `repair:status:${statusId}`,
        async () => {
          const statusQuery = "SELECT * FROM repair_status WHERE id = ?"
          const status = await dbQueryExecutor.execute(statusQuery, [statusId])

          if (!status || status.length <= 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(status[0].created_by_user_id),
            status[0].last_modified_by_user_id
              ? User.findByUserId(status[0].last_modified_by_user_id)
              : null
          ])

          const statusWithDetails = {
            id: status[0].id,
            name: status[0].name,
            color: status[0].color,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: status[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: status[0].last_modified_datetime
          }

          return [statusWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: (name) => {
      const query = "SELECT * FROM repair_status WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    create: (name, color, createdByUserId) => {
      const query =
        "INSERT INTO repair_status (name, color, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor
        .execute(query, [name, color, createdByUserId])
        .then((result) => {
          return revalidateCache("repair:status").then(() => result)
        })
    },
    update: (statusId, name, color, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_status SET name = ?, color = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, color, lastModifiedByUserId, statusId])
        .then((result) => {
          return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
        })
    },
    delete: (statusId) => {
      const query = "DELETE FROM repair_status WHERE id = ?"
      return dbQueryExecutor.execute(query, [statusId]).then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
    }
  },
  entryAccessory: {
    findAll: withCache("repair:entryAccessories", async () => {
      const entryAccessoriesQuery = "SELECT * FROM repair_entry_accessories_options ORDER BY name"
      const entryAccessories = await dbQueryExecutor.execute(entryAccessoriesQuery)

      const entryAccessoriesWithDetails = await Promise.all(
        entryAccessories.map(async (entryAccessory) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(entryAccessory.created_by_user_id),
            entryAccessory.last_modified_by_user_id
              ? User.findByUserId(entryAccessory.last_modified_by_user_id)
              : null
          ])

          return {
            id: entryAccessory.id,
            name: entryAccessory.name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: entryAccessory.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: entryAccessory.last_modified_datetime
          }
        })
      )

      return entryAccessoriesWithDetails
    }),
    findByAccessoryId: (accessoryId) =>
      withCache(
        `repair:entryAccessory:${accessoryId}`,
        async () => {
          const entryAccessoryQuery = "SELECT * FROM repair_entry_accessories_options WHERE id = ?"
          const entryAccessory = await dbQueryExecutor.execute(entryAccessoryQuery, [accessoryId])

          if (!entryAccessory || entryAccessory.length <= 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(entryAccessory[0].created_by_user_id),
            entryAccessory[0].last_modified_by_user_id
              ? User.findByUserId(entryAccessory[0].last_modified_by_user_id)
              : null
          ])

          const entryAccessoryWithDetails = {
            id: entryAccessory[0].id,
            name: entryAccessory[0].name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: entryAccessory[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: entryAccessory[0].last_modified_datetime
          }

          return [entryAccessoryWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: (name) => {
      const query = "SELECT * FROM repair_entry_accessories_options WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    findByRepairId: (repairId) => {
      const query = `
        SELECT 
          reao.id AS id, 
          reao.name AS name 
        FROM repair_entry_accessories rea
        JOIN repair_entry_accessories_options reao 
        ON rea.accessory_option_id = reao.id
        WHERE rea.repair_id = ?`
      return dbQueryExecutor.execute(query, [repairId])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_entry_accessories_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repair:entryAccessories").then(() => result)
      })
    },
    update: (accessoryId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_entry_accessories_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, accessoryId])
        .then((result) => {
          return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
        })
    },
    delete: (accessoryId) => {
      const query = "DELETE FROM repair_entry_accessories_options WHERE id = ?"
      return dbQueryExecutor.execute(query, [accessoryId]).then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
    }
  },
  entryReportedIssue: {
    findAll: withCache("repair:entryReportedIssues", async () => {
      const entryReportedIssuesQuery =
        "SELECT * FROM repair_entry_reported_issues_options ORDER BY name"
      const entryReportedIssues = await dbQueryExecutor.execute(entryReportedIssuesQuery)

      const entryReportedIssuesWithDetails = await Promise.all(
        entryReportedIssues.map(async (entryReportedIssue) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(entryReportedIssue.created_by_user_id),
            entryReportedIssue.last_modified_by_user_id
              ? User.findByUserId(entryReportedIssue.last_modified_by_user_id)
              : null
          ])

          return {
            id: entryReportedIssue.id,
            name: entryReportedIssue.name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: entryReportedIssue.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: entryReportedIssue.last_modified_datetime
          }
        })
      )

      return entryReportedIssuesWithDetails
    }),
    findByReportedIssueId: (reportedIssueId) =>
      withCache(
        `repair:entryReportedIssue:${reportedIssueId}`,
        async () => {
          const entryReportedIssueQuery =
            "SELECT * FROM repair_entry_reported_issues_options WHERE id = ?"
          const entryReportedIssue = await dbQueryExecutor.execute(entryReportedIssueQuery, [
            reportedIssueId
          ])

          if (!entryReportedIssue || entryReportedIssue.length <= 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(entryReportedIssue[0].created_by_user_id),
            entryReportedIssue[0].last_modified_by_user_id
              ? User.findByUserId(entryReportedIssue[0].last_modified_by_user_id)
              : null
          ])

          const entryReportedIssueWithDetails = {
            id: entryReportedIssue[0].id,
            name: entryReportedIssue[0].name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: entryReportedIssue[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: entryReportedIssue[0].last_modified_datetime
          }

          return [entryReportedIssueWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: (name) => {
      const query = "SELECT * FROM repair_entry_reported_issues_options WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    findByRepairId: (repairId) => {
      const query = `
        SELECT 
          rerio.id AS id, 
          rerio.name AS name 
        FROM repair_entry_reported_issues reri
        JOIN repair_entry_reported_issues_options rerio 
        ON reri.reported_issue_option_id = rerio.id
        WHERE reri.repair_id = ?`
      return dbQueryExecutor.execute(query, [repairId])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_entry_reported_issues_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repair:entryReportedIssues").then(() => result)
      })
    },
    update: (reportedIssueId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_entry_reported_issues_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, reportedIssueId])
        .then((result) => {
          return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
        })
    },
    delete: (reportedIssueId) => {
      const query = "DELETE FROM repair_entry_reported_issues_options WHERE id = ?"
      return dbQueryExecutor.execute(query, [reportedIssueId]).then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
    }
  },
  interventionWorkDone: {
    findAll: withCache("repair:interventionWorksDone", async () => {
      const interventionWorksDoneQuery =
        "SELECT * FROM repair_intervention_works_done_options ORDER BY name"
      const interventionWorksDone = await dbQueryExecutor.execute(interventionWorksDoneQuery)

      const interventionWorksDoneWithDetails = await Promise.all(
        interventionWorksDone.map(async (interventionWorkDone) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(interventionWorkDone.created_by_user_id),
            interventionWorkDone.last_modified_by_user_id
              ? User.findByUserId(interventionWorkDone.last_modified_by_user_id)
              : null
          ])

          return {
            id: interventionWorkDone.id,
            name: interventionWorkDone.name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: interventionWorkDone.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: interventionWorkDone.last_modified_datetime
          }
        })
      )

      return interventionWorksDoneWithDetails
    }),
    findByInterventionWorkDoneId: (interventionWorkDoneId) =>
      withCache(
        `repair:interventionWorkDone:${interventionWorkDoneId}`,
        async () => {
          const interventionWorkDoneQuery =
            "SELECT * FROM repair_intervention_works_done_options WHERE id = ?"
          const interventionWorkDone = await dbQueryExecutor.execute(interventionWorkDoneQuery, [
            interventionWorkDoneId
          ])

          if (!interventionWorkDone || interventionWorkDone.length === 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(interventionWorkDone[0].created_by_user_id),
            interventionWorkDone[0].last_modified_by_user_id
              ? User.findByUserId(interventionWorkDone[0].last_modified_by_user_id)
              : null
          ])

          const interventionWorkDoneWithDetails = {
            id: interventionWorkDone[0].id,
            name: interventionWorkDone[0].name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: interventionWorkDone[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: interventionWorkDone[0].last_modified_datetime
          }

          return [interventionWorkDoneWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: (name) => {
      const query = "SELECT * FROM repair_intervention_works_done_options WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    findByRepairId: (repairId) => {
      const query = `
        SELECT 
          riwdo.id AS id, 
          riwdo.name AS name 
        FROM repair_intervention_works_done riwd
        JOIN repair_intervention_works_done_options riwdo 
        ON riwd.work_done_option_id = riwdo.id
        WHERE riwd.repair_id = ?`
      return dbQueryExecutor.execute(query, [repairId])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_intervention_works_done_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repair:interventionWorksDone").then(() => result)
      })
    },
    update: (workDoneId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_intervention_works_done_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, workDoneId])
        .then((result) => {
          return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
        })
    },
    delete: (workDoneId) => {
      const query = "DELETE FROM repair_intervention_works_done_options WHERE id = ?"
      return dbQueryExecutor.execute(query, [workDoneId]).then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
    }
  },
  interventionAccessoryUsed: {
    findAll: withCache("repair:interventionAccessoriesUsed", async () => {
      const interventionAccessoriesUsedQuery =
        "SELECT * FROM repair_intervention_accessories_used_options ORDER BY name"
      const interventionAccessoriesUsed = await dbQueryExecutor.execute(
        interventionAccessoriesUsedQuery
      )

      const interventionAccessoriesUsedWithDetails = await Promise.all(
        interventionAccessoriesUsed.map(async (interventionAccessoryUsed) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(interventionAccessoryUsed.created_by_user_id),
            interventionAccessoryUsed.last_modified_by_user_id
              ? User.findByUserId(interventionAccessoryUsed.last_modified_by_user_id)
              : null
          ])

          return {
            id: interventionAccessoryUsed.id,
            name: interventionAccessoryUsed.name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: interventionAccessoryUsed.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: interventionAccessoryUsed.last_modified_datetime
          }
        })
      )

      return interventionAccessoriesUsedWithDetails
    }),
    findByInterventionAccessoryUsedId: (interventionAccessoryUsedId) =>
      withCache(
        `repair:interventionAccessoryUsed:${interventionAccessoryUsedId}`,
        async () => {
          const interventionAccessoryUsedQuery =
            "SELECT * FROM repair_intervention_accessories_used_options WHERE id = ?"
          const interventionAccessoryUsed = await dbQueryExecutor.execute(
            interventionAccessoryUsedQuery,
            [interventionAccessoryUsedId]
          )

          if (!interventionAccessoryUsed || interventionAccessoryUsed.length === 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(interventionAccessoryUsed[0].created_by_user_id),
            interventionAccessoryUsed[0].last_modified_by_user_id
              ? User.findByUserId(interventionAccessoryUsed[0].last_modified_by_user_id)
              : null
          ])

          const interventionAccessoryUsedWithDetails = {
            id: interventionAccessoryUsed[0].id,
            name: interventionAccessoryUsed[0].name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: interventionAccessoryUsed[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: interventionAccessoryUsed[0].last_modified_datetime
          }

          return [interventionAccessoryUsedWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: (name) => {
      const query = "SELECT * FROM repair_intervention_accessories_used_options WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    findByRepairId: (repairId) => {
      const query = `
        SELECT 
          riauo.id AS id, 
          riauo.name AS name 
        FROM repair_intervention_accessories_used ria
        JOIN repair_intervention_accessories_used_options riauo 
        ON ria.accessories_used_option_id = riauo.id
        WHERE ria.repair_id = ?`
      return dbQueryExecutor.execute(query, [repairId])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_intervention_accessories_used_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repair:interventionAccessoriesUsed").then(() => result)
      })
    },
    update: (accessoryUsedId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_intervention_accessories_used_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, accessoryUsedId])
        .then((result) => {
          return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
        })
    },
    delete: (accessoryUsedId) => {
      const query = "DELETE FROM repair_intervention_accessories_used_options WHERE id = ?"
      return dbQueryExecutor.execute(query, [accessoryUsedId]).then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
    }
  },
  attachment: {
    findAllByRepairId: async (repairId) => {
      const attachmentsQuery =
        "SELECT id, repair_id, original_filename, file_size, file_mime_type, type, uploaded_by_user_id, uploaded_at_datetime FROM repair_attachments WHERE repair_id = ? ORDER BY uploaded_at_datetime DESC"
      const attachments = await dbQueryExecutor.execute(attachmentsQuery, [repairId])

      const attachmentsWithUserDetails = await Promise.all(
        attachments.map(async (attachment) => {
          const [uploadedByUser] = await Promise.all([
            User.findByUserId(attachment.uploaded_by_user_id)
          ])

          return {
            id: attachment.id,
            repair_id: attachment.repair_id,
            original_filename: attachment.original_filename,
            file_size: attachment.file_size,
            file_mime_type: attachment.file_mime_type,
            type: attachment.type,
            uploaded_by_user: uploadedByUser.length > 0 ? mapUser(uploadedByUser[0]) : null,
            uploaded_at_datetime: attachment.uploaded_at_datetime
          }
        })
      )

      return attachmentsWithUserDetails
    },
    findByAttachmentId: (attachmentId) =>
      withCache(
        `repair:attachment:${attachmentId}`,
        async () => {
          const query = "SELECT * FROM repair_attachments WHERE id = ?"
          return dbQueryExecutor.execute(query, [attachmentId])
        },
        diskOnlyCache
      )(),
    create: async (repairId, attachments, uploadedByUserId) => {
      let transaction

      try {
        transaction = await dbQueryExecutor.startTransaction()

        const attachmentPromises = attachments.map(async (attachment) => {
          const { file, fileMimeType, fileSize, originalFilename, type } = attachment

          const attachmentQuery =
            "INSERT INTO repair_attachments (repair_id, file, file_mime_type, file_size, original_filename, type, uploaded_by_user_id, uploaded_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"

          const attachmentResult = await dbQueryExecutor.execute(
            attachmentQuery,
            [repairId, file, fileMimeType, fileSize, originalFilename, type, uploadedByUserId],
            transaction
          )

          return attachmentResult
        })

        const attachmentResults = await Promise.all(attachmentPromises)

        await dbQueryExecutor.commitTransaction(transaction)

        await revalidateCache(["repairs", `repair:${repairId}`])

        return attachmentResults
      } catch (error) {
        if (transaction) {
          await dbQueryExecutor.rollbackTransaction(transaction)
        }
        throw error
      }
    },
    delete: async (repairId, attachmentId) => {
      const query = "DELETE FROM repair_attachments WHERE id = ?"
      return dbQueryExecutor.execute(query, [attachmentId]).then((result) => {
        return revalidateCache([
          "repairs",
          `repair:${repairId}`,
          `repair:attachment:${attachmentId}`
        ]).then(() => result)
      })
    }
  },
  interactionsHistory: {
    findByRepairId: (repairId) =>
      withCache(
        `repair:interactionsHistory:${repairId}`,
        async () => {
          const query =
            "SELECT * FROM repair_interactions_history WHERE repair_id = ? ORDER BY created_at_datetime DESC"
          const interactions = await dbQueryExecutor.execute(query, [repairId])

          const interactionsWithDetails = await Promise.all(
            interactions.map(async (interaction) => {
              const responsibleUser = await User.findByUserId(interaction.responsible_user_id)

              return {
                id: interaction.id,
                equipment_id: interaction.equipment_id,
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
    create: (repairId, interactionType, details, responsibleUserId) => {
      if (HISTORY_ENABLED) {
        const query =
          "INSERT INTO repair_interactions_history (repair_id, type, details, responsible_user_id, created_at_datetime) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())"
        return dbQueryExecutor
          .execute(query, [repairId, interactionType, details, responsibleUserId])
          .then((result) => {
            return revalidateCache(`repair:interactionsHistory:${repairId}`).then(() => result)
          })
      }
    }
  }
}

module.exports = Repair
