import { api } from ".."

const getUserProfile = async () => {
  const response = await api.get("/users/profile")
  return response.data[0]
}

const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export { getUserProfile, getUserById }
