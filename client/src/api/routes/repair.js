import { api } from ".."

export const getRepairSummary = async () => {
  const response = await api.get("/repairs/analytics/summary")
  return response.data
}

export const getRepairActivity = async ({ year }) => {
  const response = await api.get(
    `/repairs/analytics/activity/${year ? year : new Date().getFullYear()}`
  )
  return response.data
}

export const getAllRepairs = async () => {
  const response = await api.get("/repairs")
  return response.data
}

export const getRepairById = async ({ repairId }) => {
  const response = await api.get(`/repairs/${repairId}`)
  return response.data
}

export const createRepair = async ({ equipmentId, statusId, entryDescription, entryDatetime }) => {
  const response = await api.post("/repairs", {
    equipmentId,
    statusId,
    entryDescription,
    entryDatetime
  })
  return response.data
}

export const updateRepair = async ({
  repairId,
  statusId,
  entryAccessories,
  entryAccessoriesDescription,
  entryReportedIssues,
  entryReportedIssuesDescription,
  entryDescription,
  entryDatetime,
  interventionWorksDone,
  interventionWorksDoneDescription,
  interventionAccessoriesUsed,
  interventionAccessoriesUsedDescription,
  conclusionDatetime,
  deliveryDatetime,
  isClientNotified,
  interventionDescription
}) => {
  const response = await api.put(`/repairs/${repairId}`, {
    statusId,
    entryAccessories,
    entryAccessoriesDescription,
    entryReportedIssues,
    entryReportedIssuesDescription,
    entryDescription,
    entryDatetime,
    interventionWorksDone,
    interventionWorksDoneDescription,
    interventionAccessoriesUsed,
    interventionAccessoriesUsedDescription,
    conclusionDatetime,
    deliveryDatetime,
    isClientNotified,
    interventionDescription
  })
  return response.data
}

export const deleteRepair = async ({ repairId }) => {
  const response = await api.delete(`/repairs/${repairId}`)
  return response.data
}

export const createRepairAttachment = async ({ repairId, attachments }) => {
  const formData = new FormData()
  attachments.forEach((file) => {
    formData.append("attachments", file)
  })

  const response = await api.post(`/repairs/${repairId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

export const deleteRepairAttachment = async ({ repairId, attachmentId }) => {
  const response = await api.delete(`/repairs/${repairId}/attachments/${attachmentId}`)
  return response.data
}

export const getAllRepairStatuses = async () => {
  const response = await api.get("/repairs/status")
  return response.data
}

export const createRepairStatus = async ({ name, color }) => {
  const response = await api.post("/repairs/status", { name, color })
  return response.data
}

export const updateRepairStatus = async ({ statusId, name, color }) => {
  const response = await api.put(`/repairs/status/${statusId}`, { name, color })
  return response.data
}

export const deleteRepairStatus = async ({ statusId }) => {
  const response = await api.delete(`/repairs/status/${statusId}`)
  return response.data
}

export const getAllEntryAccessories = async () => {
  const response = await api.get("/repairs/entry-accessories")
  return response.data
}

export const createEntryAccessory = async ({ name }) => {
  const response = await api.post("/repairs/entry-accessories", { name })
  return response.data
}

export const updateEntryAccessory = async ({ entryAccessoryId, name }) => {
  const response = await api.put(`/repairs/entry-accessories/${entryAccessoryId}`, { name })
  return response.data
}

export const deleteEntryAccessory = async ({ entryAccessoryId }) => {
  const response = await api.delete(`/repairs/entry-accessories/${entryAccessoryId}`)
  return response.data
}

export const getAllEntryReportedIssues = async () => {
  const response = await api.get("/repairs/entry-reported-issues")
  return response.data
}

export const createEntryReportedIssue = async ({ name }) => {
  const response = await api.post("/repairs/entry-reported-issues", { name })
  return response.data
}

export const updateEntryReportedIssue = async ({ entryReportedIssueId, name }) => {
  const response = await api.put(`/repairs/entry-reported-issues/${entryReportedIssueId}`, { name })
  return response.data
}

export const deleteEntryReportedIssue = async ({ entryReportedIssueId }) => {
  const response = await api.delete(`/repairs/entry-reported-issues/${entryReportedIssueId}`)
  return response.data
}

export const getAllInterventionWorksDone = async () => {
  const response = await api.get("/repairs/intervention-works-done")
  return response.data
}

export const createInterventionWorkDone = async ({ name }) => {
  const response = await api.post("/repairs/intervention-works-done", { name })
  return response.data
}

export const updateInterventionWorkDone = async ({ interventionWorkDoneId, name }) => {
  const response = await api.put(`/repairs/intervention-works-done/${interventionWorkDoneId}`, {
    name
  })
  return response.data
}

export const deleteInterventionWorkDone = async ({ interventionWorkDoneId }) => {
  const response = await api.delete(`/repairs/intervention-works-done/${interventionWorkDoneId}`)
  return response.data
}

export const getAllInterventionAccessoriesUsed = async () => {
  const response = await api.get("/repairs/intervention-accessories-used")
  return response.data
}

export const createInterventionAccessoryUsed = async ({ name }) => {
  const response = await api.post("/repairs/intervention-accessories-used", { name })
  return response.data
}

export const updateInterventionAccessoryUsed = async ({ interventionAccessoryUsedId, name }) => {
  const response = await api.put(
    `/repairs/intervention-accessories-used/${interventionAccessoryUsedId}`,
    { name }
  )
  return response.data
}

export const deleteInterventionAccessoryUsed = async ({ interventionAccessoryUsedId }) => {
  const response = await api.delete(
    `/repairs/intervention-accessories-used/${interventionAccessoryUsedId}`
  )
  return response.data
}
