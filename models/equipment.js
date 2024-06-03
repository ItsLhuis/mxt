const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Client = require("@models/client")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const { HISTORY_ENABLED } = require("@constants/config")

const Equipment = {
  findAll: withCache("equipments", async () => {
    const equipmentsQuery =
      "SELECT * FROM equipments ORDER BY COALESCE(last_modified_datetime, created_at_datetime) DESC"
    const equipments = await dbQueryExecutor.execute(equipmentsQuery)

    const equipmentsWithDetails = await Promise.all(
      equipments.map(async (equipment) => {
        const [
          client,
          brand,
          model,
          type,
          interactionsHistory,
          createdByUser,
          lastModifiedByUser,
          attachments
        ] = await Promise.all([
          Client.contact.findByClientId(equipment.client_id),
          Equipment.brand.findByBrandId(equipment.brand_id),
          Equipment.model.findByModelId(equipment.model_id),
          Equipment.type.findByTypeId(equipment.type_id),
          Equipment.interactionsHistory.findByEquipmentId(equipment.id),
          User.findByUserId(equipment.created_by_user_id),
          equipment.last_modified_by_user_id
            ? User.findByUserId(equipment.last_modified_by_user_id)
            : Promise.resolve(null),
          Equipment.attachment.findAllByEquipmentId(equipment.id)
        ])

        return {
          id: equipment.id,
          client: {
            id: client[0].id,
            name: client[0].name,
            description: client[0].description
          },
          brand: { id: brand[0].id, name: brand[0].name },
          model: { id: model[0].id, name: model[0].name },
          type: { id: type[0].id, name: type[0].name },
          sn: equipment.sn,
          description: equipment.description,
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: equipment.created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: equipment.last_modified_datetime,
          attachments,
          interactionsHistory
        }
      })
    )

    return equipmentsWithDetails
  }),
  findByEquipmentId: (equipmentId) =>
    withCache(
      `equipment:${equipmentId}`,
      async () => {
        const equipmentQuery = "SELECT * FROM equipments WHERE id = ?"
        const equipment = await dbQueryExecutor.execute(equipmentQuery, [equipmentId])

        if (!equipment || equipment.length <= 0) {
          return []
        }

        const [
          client,
          brand,
          model,
          type,
          interactionsHistory,
          createdByUser,
          lastModifiedByUser,
          attachments
        ] = await Promise.all([
          Client.contact.findByClientId(equipment.client_id),
          Equipment.brand.findByBrandId(equipment.brand_id),
          Equipment.model.findByModelId(equipment.model_id),
          Equipment.type.findByTypeId(equipment.type_id),
          Equipment.interactionsHistory.findByEquipmentId(equipment.id),
          User.findByUserId(equipment.created_by_user_id),
          equipment.last_modified_by_user_id
            ? User.findByUserId(equipment.last_modified_by_user_id)
            : Promise.resolve(null),
          Equipment.attachment.findAllByEquipmentId(equipmentId)
        ])

        const equipmentWithDetails = {
          id: equipment[0].id,
          client: {
            id: client[0].id,
            name: client[0].name,
            description: client[0].description
          },
          brand: { id: brand[0].id, name: brand[0].name },
          model: { id: model[0].id, name: model[0].name },
          type: { id: type[0].id, name: type[0].name },
          sn: equipment[0].sn,
          description: equipment[0].description,
          created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
          created_at_datetime: equipment[0].created_at_datetime,
          last_modified_by_user:
            lastModifiedByUser && lastModifiedByUser.length > 0
              ? mapUser(lastModifiedByUser[0])
              : null,
          last_modified_datetime: equipment[0].last_modified_datetime,
          attachments,
          interactionsHistory
        }

        return [equipmentWithDetails]
      },
      memoryOnlyCache
    )(),
  create: (clientId, brandId, modelId, typeId, sn, description, createdByUserId) => {
    const query = `
      INSERT INTO equipments (client_id, brand_id, model_id, type_id, sn, description, created_by_user_id, created_at_datetime) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `
    return dbQueryExecutor
      .execute(query, [clientId, brandId, modelId, typeId, sn, description, createdByUserId])
      .then((result) => {
        return revalidateCache("equipments").then(() => result)
      })
  },
  update: (equipmentId, brandId, modelId, typeId, sn, description, lastModifiedByUserId) => {
    const query =
      "UPDATE equipments SET brand_id = ?, model_id = ?, type_id = ?, sn = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [
        brandId,
        modelId,
        typeId,
        sn,
        description,
        lastModifiedByUserId,
        equipmentId
      ])
      .then(() => {
        return revalidateCache(["equipments", `equipment:${equipmentId}`]).then((result) => result)
      })
  },
  updateClientId: (equipmentId, clientId, lastModifiedByUserId) => {
    const query =
      "UPDATE equipments SET client_id = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [clientId, lastModifiedByUserId, equipmentId])
      .then((result) => {
        return revalidateCache(["equipments", `equipment:${equipmentId}`]).then(() => result)
      })
  },
  delete: (equipmentId) => {
    const query = "DELETE FROM equipments WHERE id = ?"
    return dbQueryExecutor.execute(query, [equipmentId]).then((result) => {
      return revalidateCache(["equipments", `equipment:${equipmentId}`]).then(() => result)
    })
  },
  brand: {
    findAll: withCache("equipmentBrands", async () => {
      const query = "SELECT * FROM equipment_brands ORDER BY name"
      return dbQueryExecutor.execute(query)
    }),
    findByBrandId: async (brandId) => {
      const query = "SELECT * FROM equipment_brands WHERE id = ?"
      return dbQueryExecutor.execute(query, [brandId])
    },
    findByName: async (name) => {
      const query = "SELECT * FROM equipment_brands WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO equipment_brands (name, created_by_user_id, created_at_datetime) VALUES (?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("equipmentBrands").then(() => result)
      })
    },
    update: (brandId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE equipment_brands SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, brandId])
        .then((result) => {
          return revalidateCache("equipmentBrands").then(() => result)
        })
    },
    delete: (brandId) => {
      const query = "DELETE FROM equipment_brands WHERE id = ?"
      return dbQueryExecutor.execute(query, [brandId]).then((result) => {
        return revalidateCache("equipmentBrands").then(() => result)
      })
    }
  },
  model: {
    findAll: withCache("equipmentModels", async () => {
      const query = "SELECT * FROM equipment_models ORDER BY name"
      return dbQueryExecutor.execute(query)
    }),
    findByModelId: async (modelId) => {
      const query = "SELECT * FROM equipment_models WHERE id = ?"
      return dbQueryExecutor.execute(query, [modelId])
    },
    findByBrandId: async (brandId) => {
      const query = "SELECT * FROM equipment_models WHERE brand_id = ? ORDER BY name"
      return dbQueryExecutor.execute(query, [brandId])
    },
    findByNameAndBrandId: async (name, brandId) => {
      const query = "SELECT * FROM equipment_models WHERE name = ? AND brand_id = ?"
      return dbQueryExecutor.execute(query, [name, brandId])
    },
    create: (brandId, name, createdByUserId) => {
      const query =
        "INSERT INTO equipment_models (brand_id, name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, NOW())"
      return dbQueryExecutor.execute(query, [brandId, name, createdByUserId]).then((result) => {
        return revalidateCache("equipmentModels").then(() => result)
      })
    },
    update: (modelId, brandId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE equipment_models SET brand_id = ?, name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [brandId, name, lastModifiedByUserId, modelId])
        .then((result) => {
          return revalidateCache("equipmentModels").then(() => result)
        })
    },
    delete: (modelId) => {
      const query = "DELETE FROM equipment_models WHERE id = ?"
      return dbQueryExecutor.execute(query, [modelId]).then((result) => {
        return revalidateCache("equipmentModels").then(() => result)
      })
    }
  },
  type: {
    findAll: withCache("equipmentTypes", async () => {
      const query = "SELECT * FROM equipment_types ORDER BY name"
      return dbQueryExecutor.execute(query)
    }),
    findByTypeId: async (typeId) => {
      const query = "SELECT * FROM equipment_types WHERE id = ?"
      return dbQueryExecutor.execute(query, [typeId])
    },
    findByName: async (name) => {
      const query = "SELECT * FROM equipment_types WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    create: (name) => {
      const query =
        "INSERT INTO equipment_types (name, created_by_user_id, created_at_datetime) VALUES (?, ?, NOW())"
      return dbQueryExecutor.execute(query, [name]).then((result) => {
        return revalidateCache("equipmentTypes").then(() => result)
      })
    },
    update: (typeId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE equipment_types SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = NOW() WHERE id = ?"
      return dbQueryExecutor.execute(query, [name, lastModifiedByUserId, typeId]).then((result) => {
        return revalidateCache("equipmentTypes").then(() => result)
      })
    },
    delete: (typeId) => {
      const query = "DELETE FROM equipment_types WHERE id = ?"
      return dbQueryExecutor.execute(query, [typeId]).then((result) => {
        return revalidateCache("equipmentTypes").then(() => result)
      })
    }
  },
  attachment: {
    findAllByEquipmentId: async (equipmentId) => {
      const query = "SELECT * FROM equipment_attachments WHERE equipment_id = ?"
      return dbQueryExecutor.execute(query, [equipmentId])
    },
    findByAttachmentId: async (attachmentId) => {
      const query = "SELECT * FROM equipment_attachments WHERE id = ?"
      return dbQueryExecutor.execute(query, [attachmentId])
    },
    create: async (equipmentId, file, originalFilename, type, uploadedByUserId) => {
      const query =
        "INSERT INTO equipment_attachments (equipment_id, file, original_filename, type, uploaded_by_user_id) VALUES (?, ?, ?, ?, ?)"
      return dbQueryExecutor.execute(query, [
        equipmentId,
        file,
        originalFilename,
        type,
        uploadedByUserId
      ])
    },
    delete: async (attachmentId) => {
      const query = "DELETE FROM equipment_attachments WHERE id = ?"
      return dbQueryExecutor.execute(query, [attachmentId])
    }
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
      if (HISTORY_ENABLED) {
        const query =
          "INSERT INTO equipment_interactions_history (equipment_id, type, details, responsible_user_id, created_at_datetime) VALUES (?, ?, ?, ?, NOW())"
        return dbQueryExecutor
          .execute(query, [equipmentId, interactionType, details, responsibleUserId])
          .then((result) => {
            return revalidateCache(`equipment:interactionsHistory:${equipmentId}`).then(
              () => result
            )
          })
      }
    }
  }
}

module.exports = Equipment
