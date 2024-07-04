import { api } from ".."

export const getAllEquipments = async () => {
  const response = await api.get("/equipments")
  return response.data
}

export const getEquipmentById = async ({ equipmentId }) => {
  const response = await api.get(`/equipments/${equipmentId}`)
  return response.data
}

export const createEquipment = async ({ clientId, brandId, modelId, typeId, sn, description }) => {
  const response = await api.post("/equipments", {
    clientId,
    brandId,
    modelId,
    typeId,
    sn,
    description
  })
  return response.data
}

export const updateEquipment = async ({
  equipmentId,
  brandId,
  modelId,
  typeId,
  sn,
  description
}) => {
  const response = await api.put(`/equipments/${equipmentId}`, {
    brandId,
    modelId,
    typeId,
    sn,
    description
  })
  return response.data
}

export const deleteEquipment = async ({ equipmentId }) => {
  const response = await api.delete(`/equipments/${equipmentId}`)
  return response.data
}

export const getAllEquipmentTypes = async () => {
  const response = await api.get("/equipments/types")
  return response.data
}
