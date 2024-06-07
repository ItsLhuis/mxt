import { api } from ".."

const getUserProfile = async () => {
  const response = await api.get("/users/profile")
  return response.data
}

const getUserAvatar = async (userId, { quality = 100, size = 40, blur = 0 } = {}) => {
  const response = await api.get(`/users/${userId}/avatar`, {
    responseType: "blob",
    params: {
      quality,
      size,
      blur
    }
  })

  return URL.createObjectURL(response.data)
}

const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export { getUserProfile, getUserAvatar, getUser }
