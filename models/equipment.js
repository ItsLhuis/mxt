const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Equipment = {
  findAll: withCache("equipments", async () => {
    return []
  }),
  findByEquipmentId: (equipmentId) =>
    withCache(
      `equipment:${equipmentId}`,
      async () => {
        return []
      },
      memoryOnlyCache
    )(),
  create: (name, description, createdByUserId) => {
    const query =
      "INSERT INTO clients (name, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, NOW())"
    return dbQueryExecutor.execute(query, [name, description, createdByUserId]).then((result) => {
      return revalidateCache("equipments").then(() => result)
    })
  },
  interactionsHistory: {
    findByEquipmentId: (equipmentId) =>
      withCache(
        `equipment:interactionsHistory:${equipmentId}`,
        async () => {
          return []
        },
        memoryOnlyCache
      )(),
    create: (equipmentId, interactionType, details, responsibleUserId) => {
      const query =
        "INSERT INTO equipment_interactions_history (equipment_id, type, details, responsible_user_id, created_at_datetime) VALUES (?, ?, ?, ?, NOW())"
      return dbQueryExecutor
        .execute(query, [equipmentId, interactionType, details, responsibleUserId])
        .then((result) => {
          return revalidateCache(`equipment:interactionsHistory:${equipmentId}`).then(() => result)
        })
    }
  }
}

module.exports = Equipment
