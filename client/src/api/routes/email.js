import { api } from ".."

export const getAllEmails = async () => {
  const response = await api.get("/emails")
  return response.data
}