import { api } from ".."

export const deleteCache = async () => {
  const response = await api.delete("/cache")
  return response.data
}
