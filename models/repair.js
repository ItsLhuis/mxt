const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Equipment = require("@models/equipment")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const { HISTORY_ENABLED } = require("@constants/config")

const Repair = {
  findAll: withCache("repairs", async () => {
    const repairsQuery = "SELECT * FROM repairs"
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
            is_default: status[0].is_default
          },
          equipment_os_password: repair.equipment_os_password,
          equipment_bios_password: repair.equipment_bios_password,
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
          is_client_notified: repair.is_client_notified,
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: repair.created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: repair.last_modified_datetime,
          interactions_history: interactionsHistory,
          attachments
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
            is_default: status[0].is_default
          },
          equipment_os_password: repair[0].equipment_os_password,
          equipment_bios_password: repair[0].equipment_bios_password,
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
          is_client_notified: repair[0].is_client_notified,
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: repair[0].created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: repair[0].last_modified_datetime,
          interactions_history: interactionsHistory,
          attachments
        }

        return [repairWithDetails]
      },
      memoryOnlyCache
    )(),
  create: (
    equipmentId,
    statusId,
    clientOsPassword,
    clientBiosPassword,
    entryDescription,
    entryDatetime,
    createdByUserId
  ) => {
    const query =
      "INSERT INTO repairs (equipment_id, status_id, equipment_os_password, equipment_bios_password, entry_description, entry_datetime, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
    return dbQueryExecutor
      .execute(query, [
        equipmentId,
        statusId,
        clientOsPassword,
        clientBiosPassword,
        entryDescription,
        entryDatetime,
        createdByUserId
      ])
      .then((result) => {
        return revalidateCache("repairs").then(() => result)
      })
  },
  update: (
    repairId,
    statusId,
    clientOsPassword,
    clientBiosPassword,
    entryAccessoriesDescription,
    entryReportedIssuesDescription,
    entryDescription,
    entryDatetime,
    interventionWorksDoneDescription,
    interventionAccessoriesUsedDescription,
    interventionDescription,
    conclusionDatetime,
    deliveryDatetime,
    lastModifiedByUserId,
    {
      entryAccessoriesIds,
      entryReportedIssuesIds,
      interventionWorksDoneIds,
      interventionAccessoriesUsedIds
    } = {}
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbQueryExecutor.startTransaction()

        const updateRepairQuery =
          "UPDATE repairs SET status_id = ?, equipment_os_password = ?, equipment_bios_password = ?, entry_accessories_description = ?, entry_reported_issues_description = ?, entry_description = ?, entry_datetime = ?, intervention_works_done_description = ?, intervention_accessories_used_description = ?, intervention_description = ?, conclusion_datetime = ?, delivery_datetime = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
        const result = await dbQueryExecutor.execute(updateRepairQuery, [
          statusId,
          clientOsPassword,
          clientBiosPassword,
          entryAccessoriesDescription,
          entryReportedIssuesDescription,
          entryDescription,
          entryDatetime,
          interventionWorksDoneDescription,
          interventionAccessoriesUsedDescription,
          interventionDescription,
          conclusionDatetime,
          deliveryDatetime,
          lastModifiedByUserId,
          repairId
        ])

        const optionsMap = {
          accessory_option: { table: "repair_entry_accessories", ids: entryAccessoriesIds },
          reported_issue_option: {
            table: "repair_entry_reported_issues",
            ids: entryReportedIssuesIds
          },
          work_done_option: {
            table: "repair_intervention_works_done",
            ids: interventionWorksDoneIds
          },
          accessories_used_option: {
            table: "repair_intervention_accessories_used",
            ids: interventionAccessoriesUsedIds
          }
        }

        for (const [optionType, optionData] of Object.entries(optionsMap)) {
          const deleteOptionsQuery = `DELETE FROM ${optionData.table} WHERE repair_id = ?`
          await dbQueryExecutor.execute(deleteOptionsQuery, [repairId])

          if (optionData.ids) {
            const insertOptionsQuery = `INSERT INTO ${optionData.table} (repair_id, ${optionType}_id) VALUES (?, ?)`
            for (const optionId of optionData.ids) {
              await dbQueryExecutor.execute(insertOptionsQuery, [repairId, optionId])
            }
          }
        }

        await dbQueryExecutor.commitTransaction()

        await revalidateCache(["repairs", `repair:${repairId}`])
        resolve(result)
      } catch (error) {
        await dbQueryExecutor.rollbackTransaction()
        reject(error)
      }
    })
  },
  findByStatusId: async (statusId) => {
    const query = "SELECT * FROM repairs WHERE status_id = ?"
    return dbQueryExecutor.execute(query, [statusId])
  },
  findByEntryAccessoryId: async (entryAccessoryId) => {
    const query =
      "SELECT r.* FROM repairs r INNER JOIN repair_entry_accessories rea ON r.id = rea.repair_id WHERE rea.accessory_option_id = ?"
    return dbQueryExecutor.execute(query, [entryAccessoryId])
  },
  findByEntryReportedIssueId: async (entryReportedIssueId) => {
    const query =
      "SELECT r.* FROM repairs r INNER JOIN repair_entry_reported_issues reri ON r.id = reri.repair_id WHERE reri.reported_issue_option_id = ?"
    return dbQueryExecutor.execute(query, [entryReportedIssueId])
  },
  findByInterventionWorkDoneId: async (interventionWorkDoneId) => {
    const query =
      "SELECT r.* FROM repairs r INNER JOIN repair_intervention_works_done riwd ON r.id = riwd.repair_id WHERE riwd.work_done_option_id = ?"
    return dbQueryExecutor.execute(query, [interventionWorkDoneId])
  },
  findByInterventionAccessoryUsedId: async (interventionAccessoryUsedId) => {
    const query =
      "SELECT r.* FROM repairs r INNER JOIN repair_intervention_accessories_used riau ON r.id = riau.repair_id WHERE riau.accessories_used_option_id = ?"
    return dbQueryExecutor.execute(query, [interventionAccessoryUsedId])
  },
  findEntryAccessoriesByRepairId: async (repairId) => {
    const query =
      "SELECT ro.id, ro.name FROM repair_entry_accessories rea INNER JOIN repair_entry_accessories_options ro ON rea.accessory_option_id = ro.id WHERE rea.repair_id = ?"
    return dbQueryExecutor.execute(query, [repairId])
  },
  findEntryReportedIssuesByRepairId: async (repairId) => {
    const query =
      "SELECT rio.id, rio.name FROM repair_entry_reported_issues rei INNER JOIN repair_entry_reported_issues_options rio ON rei.reported_issue_option_id = rio.id WHERE rei.repair_id = ?"
    return dbQueryExecutor.execute(query, [repairId])
  },
  findInterventionWorksDoneByRepairId: async (repairId) => {
    const query =
      "SELECT wdo.id, wdo.name FROM repair_intervention_works_done riw INNER JOIN repair_intervention_works_done_options wdo ON riw.work_done_option_id = wdo.id WHERE riw.repair_id = ?"
    return dbQueryExecutor.execute(query, [repairId])
  },
  findInterventionAccessoriesUsedByRepairId: async (repairId) => {
    const query =
      "SELECT auo.id, auo.name FROM repair_intervention_accessories_used ria INNER JOIN repair_intervention_accessories_used_options auo ON ria.accessories_used_option_id = auo.id WHERE ria.repair_id = ?"
    return dbQueryExecutor.execute(query, [repairId])
  },
  status: {
    findAll: withCache("repairStatus", async () => {
      const query = "SELECT * FROM repair_status"
      return dbQueryExecutor.execute(query)
    }),
    findByStatusId: (statusId) =>
      withCache(
        `repairStatus:${statusId}`,
        async () => {
          const query = "SELECT * FROM repair_status WHERE id = ?"
          return dbQueryExecutor.execute(query, [statusId])
        },
        memoryOnlyCache
      )(),
    findByDefaultStatus: () =>
      withCache(
        "repairDefaultStatus",
        async () => {
          const query = "SELECT * FROM repair_status WHERE is_default = true"
          return dbQueryExecutor.execute(query)
        },
        memoryOnlyCache
      )(),
    create: (name, isDefault = false, createdByUserId) => {
      const query =
        "INSERT INTO repair_status (name, is_default, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, isDefault, createdByUserId]).then((result) => {
        return revalidateCache(["repairStatus", "repairDefaultStatus"]).then(() => result)
      })
    },
    update: (statusId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_status SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, statusId])
        .then(async (result) => {
          const allRepairsByStatusId = await Repair.findByStatusId(statusId)

          if (allRepairsByStatusId || allRepairsByStatusId.length > 0) {
            allRepairsByStatusId.map((repair) => {
              return revalidateCache(["repairs", `repair:${repair.id}`])
            })
          }

          return revalidateCache([
            "repairStatus",
            "repairDefaultStatus",
            `repairStatus:${statusId}`
          ]).then(() => result)
        })
    },
    updateDefault: (statusId, lastModifiedByUserId) => {
      const unsetDefaultQuery =
        "UPDATE repair_status SET is_default = false WHERE is_default = true"

      const setNewDefaultQuery =
        "UPDATE repair_status SET is_default = true, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"

      return dbQueryExecutor
        .execute(unsetDefaultQuery)
        .then(() => {
          return dbQueryExecutor.execute(setNewDefaultQuery, [lastModifiedByUserId, statusId])
        })
        .then(async (result) => {
          const allRepairsByStatusId = await Repair.findByStatusId(statusId)

          if (allRepairsByStatusId || allRepairsByStatusId.length > 0) {
            allRepairsByStatusId.map((repair) => {
              return revalidateCache(["repairs", `repair:${repair.id}`])
            })
          }

          return revalidateCache([
            "repairStatus",
            "repairDefaultStatus",
            `repairStatus:${statusId}`
          ]).then(() => result)
        })
    },
    delete: (statusId) => {
      const query = "DELETE FROM repair_status WHERE id = "
      return dbQueryExecutor.execute(query, [statusId]).then(async (result) => {
        const allRepairsByStatusId = await Repair.findByStatusId(statusId)

        if (allRepairsByStatusId || allRepairsByStatusId.length > 0) {
          allRepairsByStatusId.map((repair) => {
            return revalidateCache(["repairs", `repair:${repair.id}`])
          })
        }

        return revalidateCache([
          "repairStatus",
          "repairDefaultStatus",
          `repairStatus:${statusId}`
        ]).then(() => result)
      })
    }
  },
  entryAccessory: {
    findAll: withCache("repairEntryAccessories", async () => {
      const query = "SELECT * FROM repair_entry_accessories_options"
      return dbQueryExecutor.execute(query)
    }),
    findByAccessoryId: (accessoryId) =>
      withCache(
        `repairEntryAccessory:${accessoryId}`,
        async () => {
          const query = "SELECT * FROM repair_entry_accessories_options WHERE id = ?"
          return dbQueryExecutor.execute(query, [accessoryId])
        },
        memoryOnlyCache
      )(),
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_entry_accessories_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairEntryAccessories").then(() => result)
      })
    },
    update: (accessoryId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_entry_accessories_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, brandId])
        .then(async (result) => {
          const allRepairsByEntryAccessoryId = await Repair.findByEntryAccessoryId(accessoryId)

          if (allRepairsByEntryAccessoryId || allRepairsByEntryAccessoryId.length > 0) {
            allRepairsByEntryAccessoryId.map((repair) => {
              return revalidateCache(["repairs", `repair:${repair.id}`])
            })
          }

          return revalidateCache([
            "repairEntryAccessories",
            `repairEntryAccessory:${accessoryId}`
          ]).then(() => result)
        })
    },
    delete: (accessoryId) => {
      const query = "DELETE FROM repair_entry_accessories_options WHERE id = "
      return dbQueryExecutor.execute(query, [accessoryId]).then(async (result) => {
        const allRepairsByEntryAccessoryId = await Repair.findByEntryAccessoryId(accessoryId)

        if (allRepairsByEntryAccessoryId || allRepairsByEntryAccessoryId.length > 0) {
          allRepairsByEntryAccessoryId.map((repair) => {
            return revalidateCache(["repairs", `repair:${repair.id}`])
          })
        }

        return revalidateCache([
          "repairEntryAccessories",
          `repairEntryAccessory:${accessoryId}`
        ]).then(() => result)
      })
    }
  },
  entryReportedIssue: {
    findAll: withCache("repairEntryReportedIssues", async () => {
      const query = "SELECT * FROM repair_entry_reported_issues_options"
      return dbQueryExecutor.execute(query)
    }),
    findByReportedIssueId: (reportedIssueId) =>
      withCache(
        `repairEntryReportedIssue:${reportedIssueId}`,
        async () => {
          const query = "SELECT * FROM repair_entry_reported_issues_options WHERE id = ?"
          return dbQueryExecutor.execute(query, [reportedIssueId])
        },
        memoryOnlyCache
      )(),
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_entry_reported_issues_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairEntryReportedIssues").then(() => result)
      })
    },
    update: (reportedIssueId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_entry_reported_issues_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, reportedIssueId])
        .then(async (result) => {
          const allRepairsByReportedIssueId = await Repair.findByEntryReportedIssueId(
            reportedIssueId
          )

          if (allRepairsByReportedIssueId || allRepairsByReportedIssueId.length > 0) {
            allRepairsByReportedIssueId.map((repair) => {
              return revalidateCache(["repairs", `repair:${repair.id}`])
            })
          }

          return revalidateCache([
            "repairEntryReportedIssues",
            `repairEntryReportedIssue:${reportedIssueId}`
          ]).then(() => result)
        })
    },
    delete: (reportedIssueId) => {
      const query = "DELETE FROM repair_entry_reported_issues_options WHERE id = "
      return dbQueryExecutor.execute(query, [reportedIssueId]).then(async (result) => {
        const allRepairsByReportedIssueId = await Repair.findByEntryReportedIssueId(reportedIssueId)

        if (allRepairsByReportedIssueId || allRepairsByReportedIssueId.length > 0) {
          allRepairsByReportedIssueId.map((repair) => {
            return revalidateCache(["repairs", `repair:${repair.id}`])
          })
        }

        return revalidateCache([
          "repairEntryReportedIssues",
          `repairEntryReportedIssue:${reportedIssueId}`
        ]).then(() => result)
      })
    }
  },
  interventionWorkDone: {
    findAll: withCache("repairInterventionWorksDone", async () => {
      const query = "SELECT * FROM repair_intervention_works_done_options"
      return dbQueryExecutor.execute(query)
    }),
    findByInterventionWorkDoneId: (interventionWorkDoneId) =>
      withCache(
        `repairInterventionWorkDone:${interventionWorkDoneId}`,
        async () => {
          const query = "SELECT * FROM repair_intervention_works_done_options WHERE id = ?"
          return dbQueryExecutor.execute(query, [interventionWorkDoneId])
        },
        memoryOnlyCache
      )(),
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_intervention_works_done_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairInterventionWorksDone").then(() => result)
      })
    },
    update: (workDoneId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_intervention_works_done_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, workDoneId])
        .then(async (result) => {
          const allRepairsByWorkDoneId = await Repair.findByInterventionWorkDoneId(workDoneId)

          if (allRepairsByWorkDoneId || allRepairsByWorkDoneId.length > 0) {
            allRepairsByWorkDoneId.map((repair) => {
              return revalidateCache(["repairs", `repair:${repair.id}`])
            })
          }

          return revalidateCache([
            "repairInterventionWorksDone",
            `repairInterventionWorkDone:${workDoneId}`
          ]).then(() => result)
        })
    },
    delete: (workDoneId) => {
      const query = "DELETE FROM repair_intervention_works_done_options WHERE id = "
      return dbQueryExecutor.execute(query, [workDoneId]).then(async (result) => {
        const allRepairsByWorkDoneId = await Repair.findByInterventionWorkDoneId(workDoneId)

        if (allRepairsByWorkDoneId || allRepairsByWorkDoneId.length > 0) {
          allRepairsByWorkDoneId.map((repair) => {
            return revalidateCache(["repairs", `repair:${repair.id}`])
          })
        }

        return revalidateCache([
          "repairInterventionWorksDone",
          `repairInterventionWorkDone:${workDoneId}`
        ]).then(() => result)
      })
    }
  },
  interventionAccessoryUsed: {
    findAll: withCache("repairInterventionAccessoriesUsed", async () => {
      const query = "SELECT * FROM repair_intervention_accessories_used_options"
      return dbQueryExecutor.execute(query)
    }),
    findByInterventionWorkDoneId: (interventionAccessoryUsedId) =>
      withCache(
        `repairInterventionAccessoryUsed:${interventionAccessoryUsedId}`,
        async () => {
          const query = "SELECT * FROM repair_intervention_accessories_used_options WHERE id = ?"
          return dbQueryExecutor.execute(query, [interventionAccessoryUsedId])
        },
        memoryOnlyCache
      )(),
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO repair_intervention_accessories_used_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairInterventionAccessoriesUsed").then(() => result)
      })
    },
    update: (accessoryUsedId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_intervention_accessories_used_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, accessoryUsedId])
        .then(async (result) => {
          const allRepairsByAccessoryUsedId = await Repair.findByInterventionAccessoryUsedId(
            accessoryUsedId
          )

          if (allRepairsByAccessoryUsedId || allRepairsByAccessoryUsedId.length > 0) {
            allRepairsByAccessoryUsedId.map((repair) => {
              return revalidateCache(["repairs", `repair:${repair.id}`])
            })
          }

          return revalidateCache([
            "repairInterventionAccessoriesUsed",
            `repairInterventionAccessoryUsed:${accessoryUsedId}`
          ]).then(() => result)
        })
    },
    delete: (accessoryUsedId) => {
      const query = "DELETE FROM repair_intervention_accessories_used_options WHERE id = "
      return dbQueryExecutor.execute(query, [accessoryUsedId]).then(async (result) => {
        const allRepairsByAccessoryUsedId = await Repair.findByInterventionAccessoryUsedId(
          accessoryUsedId
        )

        if (allRepairsByAccessoryUsedId || allRepairsByAccessoryUsedId.length > 0) {
          allRepairsByAccessoryUsedId.map((repair) => {
            return revalidateCache(["repairs", `repair:${repair.id}`])
          })
        }

        return revalidateCache([
          "repairInterventionAccessoriesUsed",
          `repairInterventionAccessoryUsed:${accessoryUsedId}`
        ]).then(() => result)
      })
    }
  },
  attachment: {
    findAllByRepairId: async (repairId) => {
      const query = "SELECT * FROM repair_attachments WHERE repair_id = ?"
      return dbQueryExecutor.execute(query, [repairId])
    },
    findByAttachmentId: async (attachmentId) => {
      const query = "SELECT * FROM repair_attachments WHERE id = ?"
      return dbQueryExecutor.execute(query, [attachmentId])
    },
    create: async (repairId, file, originalFilename, type, uploadedByUserId) => {
      const query =
        "INSERT INTO repair_attachments (repair_id, file, original_filename, type, uploaded_by_user_id, uploaded_at_datetime) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor
        .execute(query, [repairId, file, originalFilename, type, uploadedByUserId])
        .then((result) => {
          return revalidateCache(["repairs", `repair:${repairId}`]).then(() => result)
        })
    },
    delete: async (repairId, attachmentId) => {
      const query = "DELETE FROM repair_attachments WHERE id = ?"
      return dbQueryExecutor.execute(query, [attachmentId]).then((result) => {
        return revalidateCache(["repairs", `repair:${repairId}`]).then(() => result)
      })
    }
  },
  interactionsHistory: {
    findByRepairId: (repairId) =>
      withCache(
        `repair:interactionsHistory:${repairId}`,
        async () => {
          const query =
            "SELECT * FROM repair_interactions_history WHERE repairId = ? ORDER BY created_at_datetime DESC"
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
          "INSERT INTO repair_interactions_history (repairId, type, details, responsible_user_id, created_at_datetime) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())"
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
