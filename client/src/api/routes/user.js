import { api } from ".."

const getUserProfile = async () => {
  const response = await api.get("/users/profile")
  return response.data[0]
}

const getEmplyeeByUserId = async ({ userId }) => {
  const response = await api.get(`/employees/${userId}`)
  return response.data[0]
}

const getUserById = async ({ userId }) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

const updateUserPassword = async ({ userId, password, newPassword, confirmPassword }) => {
  const response = await api.put(`/users/${userId}/password`, {
    password,
    newPassword,
    confirmPassword
  })
  return response.data
}

const updateUserProfile = async ({ username, email }) => {
  const response = await api.put("/users/profile", { username, email })
  return response.data
}

const updateUserProfileAvatar = async ({ avatar }) => {
  const formData = new FormData()
  formData.append("avatar", avatar)

  const response = await api.put("/users/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

const updateUserPersonalData = async ({
  name,
  email,
  phoneNumber,
  country,
  city,
  locality,
  address,
  postalCode,
  description
}) => {
  const response = await api.put("/employees", {
    name,
    email,
    phoneNumber,
    country,
    city,
    locality,
    address,
    postalCode,
    description
  })
  return response.data
}

export {
  getUserProfile,
  getEmplyeeByUserId,
  getUserById,
  updateUserPassword,
  updateUserProfile,
  updateUserProfileAvatar,
  updateUserPersonalData
}
