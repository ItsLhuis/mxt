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
          Client.findByClientId(equipment.client_id),
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
          interactions_history: interactionsHistory
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
          Client.findByClientId(equipment[0].client_id),
          Equipment.brand.findByBrandId(equipment[0].brand_id),
          Equipment.model.findByModelId(equipment[0].model_id),
          Equipment.type.findByTypeId(equipment[0].type_id),
          Equipment.interactionsHistory.findByEquipmentId(equipment[0].id),
          User.findByUserId(equipment[0].created_by_user_id),
          equipment[0].last_modified_by_user_id
            ? User.findByUserId(equipment[0].last_modified_by_user_id)
            : Promise.resolve(null),
          Equipment.attachment.findAllByEquipmentId(equipment[0].id)
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
          interactions_history: interactionsHistory
        }

        return [equipmentWithDetails]
      },
      memoryOnlyCache
    )(),
  findByBrandId: async (brandId) => {
    const query = "SELECT * FROM equipments WHERE brand_id = ?"
    return dbQueryExecutor.execute(query, [brandId])
  },
  findByModelId: async (modelId) => {
    const query = "SELECT * FROM equipments WHERE model_id = ?"
    return dbQueryExecutor.execute(query, [modelId])
  },
  findByTypeId: async (typeId) => {
    const query = "SELECT * FROM equipments WHERE type_id = ?"
    return dbQueryExecutor.execute(query, [typeId])
  },
  findBySn: async (sn, equipmentIdToExclude) => {
    let query = "SELECT * FROM equipments WHERE sn = ?"
    const params = [sn]

    if (equipmentIdToExclude) {
      query += " AND id != ?"
      params.push(equipmentIdToExclude)
    }

    return dbQueryExecutor.execute(query, params)
  },
  create: (clientId, brandId, modelId, typeId, sn, description, createdByUserId) => {
    const query =
      "INSERT INTO equipments (client_id, brand_id, model_id, type_id, sn, description, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
    return dbQueryExecutor
      .execute(query, [clientId, brandId, modelId, typeId, sn, description, createdByUserId])
      .then((result) => {
        return revalidateCache("equipments").then(() => result)
      })
  },
  update: (equipmentId, brandId, modelId, typeId, sn, description, lastModifiedByUserId) => {
    const query =
      "UPDATE equipments SET brand_id = ?, model_id = ?, type_id = ?, sn = ?, description = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
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
        return clearAllCaches().then(() => result)
      })
  },
  updateClientId: (equipmentId, clientId, lastModifiedByUserId) => {
    const query =
      "UPDATE equipments SET client_id = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [clientId, lastModifiedByUserId, equipmentId])
      .then((result) => {
        return clearAllCaches().then(() => result)
      })
  },
  delete: (equipmentId) => {
    const query = "DELETE FROM equipments WHERE id = ?"
    return dbQueryExecutor.execute(query, [equipmentId]).then((result) => {
      return clearAllCaches().then(() => result)
    })
  },
  brand: {
    findAll: withCache("equipmentBrands", async () => {
      const brandsQuery = "SELECT * FROM equipment_brands ORDER BY name"
      const brands = await dbQueryExecutor.execute(brandsQuery)

      const brandsWithDetails = await Promise.all(
        brands.map(async (brand) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(brand.created_by_user_id),
            brand.last_modified_by_user_id
              ? User.findByUserId(brand.last_modified_by_user_id)
              : null
          ])

          return {
            id: brand.id,
            name: brand.name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: brand.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: brand.last_modified_datetime
          }
        })
      )

      return brandsWithDetails
    }),
    findByBrandId: async (brandId) =>
      withCache(
        `equipmentBrand:${brandId}`,
        async () => {
          const brandQuery = "SELECT * FROM equipment_brands WHERE id = ?"
          const brand = await dbQueryExecutor.execute(brandQuery, [brandId])

          if (!brand || brand.length <= 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(brand[0].created_by_user_id),
            brand[0].last_modified_by_user_id
              ? User.findByUserId(brand[0].last_modified_by_user_id)
              : null
          ])

          const brandWithDetails = {
            id: brand[0].id,
            name: brand[0].name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: brand[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: brand[0].last_modified_datetime
          }

          return [brandWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: async (name) => {
      const query = "SELECT * FROM equipment_brands WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO equipment_brands (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("equipmentBrands").then(() => result)
      })
    },
    update: (brandId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE equipment_brands SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, brandId])
        .then(async (result) => {
          const allEquipmentsByBrandId = await Equipment.findByBrandId(brandId)

          if (allEquipmentsByBrandId || allEquipmentsByBrandId.length > 0) {
            allEquipmentsByBrandId.map((equipment) => {
              return revalidateCache(["equipments", `equipment:${equipment.id}`])
            })
          }

          return revalidateCache(["equipmentBrands", `equipmentBrand:${brandId}`]).then(
            () => result
          )
        })
    },
    delete: (brandId) => {
      const query = "DELETE FROM equipment_brands WHERE id = ?"
      return dbQueryExecutor.execute(query, [brandId]).then(async (result) => {
        const allEquipmentsByBrandId = await Equipment.findByBrandId(brandId)

        if (allEquipmentsByBrandId || allEquipmentsByBrandId.length > 0) {
          allEquipmentsByBrandId.map((equipment) => {
            return revalidateCache(["equipments", `equipment:${equipment.id}`])
          })
        }

        return revalidateCache(["equipmentBrands", `equipmentBrand:${brandId}`]).then(() => result)
      })
    }
  },
  model: {
    findAll: withCache("equipmentModels", async () => {
      const modelsQuery = "SELECT * FROM equipment_models ORDER BY name"
      const models = await dbQueryExecutor.execute(modelsQuery)

      const modelsWithDetails = await Promise.all(
        models.map(async (model) => {
          const [createdByUser, lastModifiedByUser, brand] = await Promise.all([
            User.findByUserId(model.created_by_user_id),
            model.last_modified_by_user_id
              ? User.findByUserId(model.last_modified_by_user_id)
              : null,
            Equipment.brand.findByBrandId(model.brand_id)
          ])

          return {
            id: model.id,
            name: model.name,
            brand: {
              id: brand[0].id,
              name: brand[0].name
            },
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: model.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: model.last_modified_datetime
          }
        })
      )

      return modelsWithDetails
    }),
    findByModelId: async (modelId) =>
      withCache(
        `equipmentModel:${modelId}`,
        async () => {
          const modelQuery = "SELECT * FROM equipment_models WHERE id = ?"
          const model = await dbQueryExecutor.execute(modelQuery, [modelId])

          if (!model || model.length <= 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser, brand] = await Promise.all([
            User.findByUserId(model[0].created_by_user_id),
            model[0].last_modified_by_user_id
              ? User.findByUserId(model[0].last_modified_by_user_id)
              : null,
            Equipment.brand.findByBrandId(model[0].brand_id)
          ])

          const modelWithDetails = {
            id: model[0].id,
            name: model[0].name,
            brand: {
              id: brand[0].id,
              name: brand[0].name
            },
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: model[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: model[0].last_modified_datetime
          }

          return [modelWithDetails]
        },
        memoryOnlyCache
      )(),
    findByBrandId: async (brandId) =>
      withCache(
        `equipmentModelsByBrand:${brandId}`,
        async () => {
          const modelsQuery = "SELECT * FROM equipment_models WHERE brand_id = ? ORDER BY name"
          const models = await dbQueryExecutor.execute(modelsQuery, [brandId])

          const modelsWithDetails = await Promise.all(
            models.map(async (model) => {
              const [createdByUser, lastModifiedByUser, brand] = await Promise.all([
                User.findByUserId(model.created_by_user_id),
                model.last_modified_by_user_id
                  ? User.findByUserId(model.last_modified_by_user_id)
                  : null,
                Equipment.brand.findByBrandId(model.brand_id)
              ])

              return {
                id: model.id,
                name: model.name,
                brand: {
                  id: brand[0].id,
                  name: brand[0].name
                },
                created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
                created_at_datetime: model.created_at_datetime,
                last_modified_by_user:
                  lastModifiedByUser && lastModifiedByUser.length > 0
                    ? mapUser(lastModifiedByUser[0])
                    : null,
                last_modified_datetime: model.last_modified_datetime
              }
            })
          )

          return modelsWithDetails
        },
        memoryOnlyCache
      )(),
    findByNameAndBrandId: async (name, brandId) => {
      const query = "SELECT * FROM equipment_models WHERE name = ? AND brand_id = ?"
      return dbQueryExecutor.execute(query, [name, brandId])
    },
    create: (brandId, name, createdByUserId) => {
      const query =
        "INSERT INTO equipment_models (brand_id, name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [brandId, name, createdByUserId]).then((result) => {
        return revalidateCache(["equipmentModels", `equipmentModelsByBrand:${brandId}`]).then(
          () => result
        )
      })
    },
    update: (modelId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE equipment_models SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, modelId])
        .then(async (result) => {
          const [modelDetails, allEquipmentsByModelId] = await Promise.all([
            Equipment.model.findByModelId(modelId),
            Equipment.findByModelId(modelId)
          ])

          if (allEquipmentsByModelId || allEquipmentsByModelId.length > 0) {
            allEquipmentsByModelId.map((equipment) => {
              return revalidateCache(["equipments", `equipment:${equipment.id}`])
            })
          }

          const cacheKeys = [
            "equipmentModels",
            `equipmentModel:${modelId}`,
            modelDetails.length > 0 && `equipmentModelsByBrand:${modelDetails[0].brand.id}`
          ].filter(Boolean)
          return revalidateCache(cacheKeys).then(() => result)
        })
    },
    delete: (modelId) => {
      const query = "DELETE FROM equipment_models WHERE id = ?"
      return dbQueryExecutor.execute(query, [modelId]).then(async (result) => {
        const [modelDetails, allEquipmentsByModelId] = await Promise.all([
          Equipment.model.findByModelId(modelId),
          Equipment.findByModelId(modelId)
        ])

        if (allEquipmentsByModelId || allEquipmentsByModelId.length > 0) {
          allEquipmentsByModelId.map((equipment) => {
            return revalidateCache(["equipments", `equipment:${equipment.id}`])
          })
        }

        const cacheKeys = [
          "equipmentModels",
          `equipmentModel:${modelId}`,
          modelDetails.length > 0 && `equipmentModelsByBrand:${modelDetails[0].brand.id}`
        ].filter(Boolean)
        return revalidateCache(cacheKeys).then(() => result)
      })
    }
  },
  type: {
    findAll: withCache("equipmentTypes", async () => {
      const typesQuery = "SELECT * FROM equipment_types ORDER BY name"
      const types = await dbQueryExecutor.execute(typesQuery)

      const typesWithDetails = await Promise.all(
        types.map(async (type) => {
          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(type.created_by_user_id),
            type.last_modified_by_user_id ? User.findByUserId(type.last_modified_by_user_id) : null
          ])

          return {
            id: type.id,
            name: type.name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: type.created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: type.last_modified_datetime
          }
        })
      )

      return typesWithDetails
    }),
    findByTypeId: async (typeId) =>
      withCache(
        `equipmentType:${typeId}`,
        async () => {
          const typeQuery = "SELECT * FROM equipment_types WHERE id = ?"
          const type = await dbQueryExecutor.execute(typeQuery, [typeId])

          if (!type || type.length <= 0) {
            return []
          }

          const [createdByUser, lastModifiedByUser] = await Promise.all([
            User.findByUserId(type[0].created_by_user_id),
            type[0].last_modified_by_user_id
              ? User.findByUserId(type[0].last_modified_by_user_id)
              : null
          ])

          const typeWithDetails = {
            id: type[0].id,
            name: type[0].name,
            created_by_user: createdByUser.length > 0 ? mapUser(createdByUser[0]) : null,
            created_at_datetime: type[0].created_at_datetime,
            last_modified_by_user:
              lastModifiedByUser && lastModifiedByUser.length > 0
                ? mapUser(lastModifiedByUser[0])
                : null,
            last_modified_datetime: type[0].last_modified_datetime
          }

          return [typeWithDetails]
        },
        memoryOnlyCache
      )(),
    findByName: async (name) => {
      const query = "SELECT * FROM equipment_types WHERE name = ?"
      return dbQueryExecutor.execute(query, [name])
    },
    create: (name, createdByUserId) => {
      const query =
        "INSERT INTO equipment_types (name, created_by_user_id, created_at_datetime) VALUES (?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor.execute(query, [name, createdByUserId]).then((result) => {
        return revalidateCache("equipmentTypes").then(() => result)
      })
    },
    update: (typeId, name, lastModifiedByUserId) => {
      const query =
        "UPDATE equipment_types SET name = ?, last_modified_by_user_id = ?, last_modified_datetime = CURRENT_TIMESTAMP() WHERE id = ?"
      return dbQueryExecutor
        .execute(query, [name, lastModifiedByUserId, typeId])
        .then(async (result) => {
          const allEquipmentsByTypeId = await Equipment.findByTypeId(typeId)

          if (allEquipmentsByTypeId || allEquipmentsByTypeId.length > 0) {
            allEquipmentsByTypeId.map((equipment) => {
              return revalidateCache(["equipments", `equipment:${equipment.id}`])
            })
          }

          return revalidateCache(["equipmentTypes", `equipmentType:${typeId}`]).then(() => result)
        })
    },
    delete: (typeId) => {
      const query = "DELETE FROM equipment_types WHERE id = ?"
      return dbQueryExecutor.execute(query, [typeId]).then(async (result) => {
        const allEquipmentsByTypeId = await Equipment.findByTypeId(typeId)

        if (allEquipmentsByTypeId || allEquipmentsByTypeId.length > 0) {
          allEquipmentsByTypeId.map((equipment) => {
            return revalidateCache(["equipments", `equipment:${equipment.id}`])
          })
        }

        return revalidateCache(["equipmentTypes", `equipmentType:${typeId}`]).then(() => result)
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
        "INSERT INTO equipment_attachments (equipment_id, file, original_filename, type, uploaded_by_user_id, uploaded_at_datetime) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
      return dbQueryExecutor
        .execute(query, [equipmentId, file, originalFilename, type, uploadedByUserId])
        .then((result) => {
          return revalidateCache(["equipments", `equipment:${equipmentId}`]).then(() => result)
        })
    },
    delete: async (equipmentId, attachmentId) => {
      const query = "DELETE FROM equipment_attachments WHERE id = ?"
      return dbQueryExecutor.execute(query, [attachmentId]).then((result) => {
        return revalidateCache(["equipments", `equipment:${equipmentId}`]).then(() => result)
      })
    }
  },
  interactionsHistory: {
    findByEquipmentId: (equipmentId) =>
      withCache(
        `equipment:interactionsHistory:${equipmentId}`,
        async () => {
          const query =
            "SELECT * FROM equipment_interactions_history WHERE equipment_id = ? ORDER BY created_at_datetime DESC"
          const interactions = await dbQueryExecutor.execute(query, [equipmentId])

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
    create: (equipmentId, interactionType, details, responsibleUserId) => {
      if (HISTORY_ENABLED) {
        const query =
          "INSERT INTO equipment_interactions_history (equipment_id, type, details, responsible_user_id, created_at_datetime) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())"
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
