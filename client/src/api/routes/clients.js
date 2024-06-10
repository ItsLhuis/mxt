import { api } from ".."

const getAllClients = async () => {
  const response = await api.get("/clients")
  return response.data
}

export { getAllClients }
