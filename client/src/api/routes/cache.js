import { api } from ".."

const deleteCache = async () => {
  const response = await api.delete("/cache")
  return response.data
}

export { deleteCache }
