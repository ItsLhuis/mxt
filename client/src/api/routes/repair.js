import { api } from ".."

export const getAllRepairs = async () => {
  const response = await api.get("/repairs")
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
