import { api } from ".."

export const getEmailSummary = async () => {
  const response = await api.get("/emails/analytics/summary")
  return response.data
}

export const getEmailActivity = async ({ year }) => {
  const response = await api.get(
    `/emails/analytics/activity/${year ? year : new Date().getFullYear()}`
  )
  return response.data
}

export const getAllEmails = async () => {
  const response = await api.get("/emails")
  return response.data
}

export const getEmailById = async ({ emailId }) => {
  const response = await api.get(`/emails/${emailId}`)
  return response.data
}

export const sendEmail = async ({
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

  const response = await api.post("/emails", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}
