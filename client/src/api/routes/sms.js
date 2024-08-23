import { api } from ".."

export const getSmsSummary = async () => {
  const response = await api.get("/smses/analytics/summary")
  return response.data
}

export const getAllSmses = async () => {
  const response = await api.get("/smses")
  return response.data
}

export const getSmsById = async ({ smsId }) => {
  const response = await api.get(`/smses/${smsId}`)
  return response.data
}

export const sendSms = async ({ clientId, contactId, message }) => {
  const response = await api.post("/smses", { clientId, contactId, message })
  return response.data
}
