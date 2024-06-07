import { api } from ".."

const getCompany = async () => {
  const response = await api.get("/company")
  return response.data
}

const updateCompany = async () => {
  const response = await api.put("/company")
  return response.data
}

export { getCompany, updateCompany }
