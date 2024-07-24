import { api } from ".."

export const getSmsSummary = async () => {
  const response = await api.get("/smses/summary")
  return response.data
}

export const getAllSmses = async () => {
  const response = await api.get("/smses")
  return response.data
}

export const getSmsById = async ({ emailId }) => {
  const response = await api.get(`/smses/${emailId}`)
  return response.data
}

export const sendSms = async ({
  clientId,
  contactId,
  subject,
  title,
  message,
  text,
  attachments
}) => {
  const formData = new FormData()
  formData.append("clientId", clientId)
  formData.append("contactId", contactId)
  formData.append("subject", subject)
  formData.append("title", title)
  formData.append("message", message)
  formData.append("text", text)

  attachments.forEach((file) => {
    formData.append("attachments", file)
  })

  const response = await api.post("/smses", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}
