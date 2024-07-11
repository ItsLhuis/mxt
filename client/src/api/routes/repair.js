import { api } from ".."

export const getAllRepairs = async () => {
  const response = await api.get("/repairs")
  return response.data
}