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

export const createEquipmentAttachment = async ({ equipmentId, attachments }) => {
  const formData = new FormData()
  attachments.forEach((file) => {
    formData.append("attachments", file)
  })

  const response = await api.post(`/equipments/${equipmentId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

export const deleteEquipmentAttachment = async ({ equipmentId, attachmentId }) => {
  const response = await api.delete(`/equipments/${equipmentId}/attachments/${attachmentId}`)
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

export const transferEquipment = async ({ equipmentId, clientId }) => {
  const response = await api.put(`/equipments/${equipmentId}/client`, { clientId })
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

export const getAllEquipmentBrands = async () => {
  const response = await api.get("/equipments/brands")
  return response.data
}

export const getAllEquipmentModels = async () => {
  const response = await api.get("/equipments/models")
  return response.data
}

export const getAllEquipmentModelsByBrandId = async ({ brandId }) => {
  const response = await api.get(`/equipments/models/brands/${brandId}`)
  return response.data
}
