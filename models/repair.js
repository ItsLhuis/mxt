const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Client = require("@models/client")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const { HISTORY_ENABLED } = require("@constants/config")

const Repair = {
  findAll: withCache("repairs", async () => {
    const query = "SELECT * FROM repairs"
    return dbQueryExecutor.execute(query)
  }),
  findByRepairId: (repairId) => withCache(`repair:${repairId}`, async () => {}, memoryOnlyCache)(),
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
      "INSERT INTO repairs (equipment_id, status_id, equipment_os_password, equipment_bios_password, entry_description, entry_datetime, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
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
          "UPDATE repairs SET status_id = ?, equipment_os_password = ?, equipment_bios_password = ?, entry_accessories_description = ?, entry_reported_issues_description = ?, entry_description = ?, entry_datetime = ?, intervention_works_done_description = ?, intervention_accessories_used_description = ?, intervention_description = ?, conclusion_datetime = ?, delivery_datetime = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
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

        await revalidateCache("repairs")
        resolve(result)
      } catch (error) {
        await dbQueryExecutor.rollbackTransaction()
        reject(error)
      }
    })
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
        "INSERT INTO repair_status (name, is_default, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name, isDefault, createdByUserId]).then((result) => {
        return revalidateCache(["repairStatus", "repairDefaultStatus"]).then(() => result)
      })
    },
    update: (statusId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_status SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
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
        "UPDATE repair_status SET is_default = true, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"

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
        "INSERT INTO repair_entry_accessories_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairEntryAccessories").then(() => result)
      })
    },
    update: (accessoryId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_entry_accessories_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
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
        "INSERT INTO repair_entry_reported_issues_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairEntryReportedIssues").then(() => result)
      })
    },
    update: (reportedIssueId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_entry_reported_issues_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
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
        "INSERT INTO repair_intervention_works_done_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairInterventionWorksDone").then(() => result)
      })
    },
    update: (workDoneId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_intervention_works_done_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
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
        "INSERT INTO repair_intervention_accessories_used_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("repairInterventionAccessoriesUsed").then(() => result)
      })
    },
    update: (accessoryUsedId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE repair_intervention_accessories_used_options SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
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
  }
}

module.exports = Repair
