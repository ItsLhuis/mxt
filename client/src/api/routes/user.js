import { api } from ".."

export const getEmployeeSummary = async () => {
  const response = await api.get("/employees/analytics/summary")
  return response.data
}

export const getEmployeeActivity = async ({ year }) => {
  const response = await api.get(
    `/employees/analytics/activity/${year ? year : new Date().getFullYear()}`
  )
  return response.data
}

export const getUserProfile = async () => {
  const response = await api.get("/users/profile")
  return response.data[0]
}

export const getAllEmployees = async () => {
  const response = await api.get("/employees")
  return response.data
}

export const getEmployeeByUserId = async ({ userId }) => {
  const response = await api.get(`/employees/${userId}`)
  return response.data[0]
}

export const getUserById = async ({ userId }) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export const createUser = async ({ username, email, password, role, isActive }) => {
  const response = await api.post("/users", { username, email, password, role, isActive })
  return response.data
}

export const updateUserRole = async ({ userId, role }) => {
  const response = await api.put(`/users/${userId}/role`, { role })
  return response.data
}

export const updateUserStatus = async ({ userId, isActive }) => {
  const response = await api.put(`/users/${userId}/status`, { isActive })
  return response.data
}

export const updateUserPassword = async ({ userId, password, newPassword, confirmPassword }) => {
  const response = await api.put(`/users/${userId}/password`, {
    password,
    newPassword,
    confirmPassword
  })
  return response.data
}

export const updateUserProfile = async ({ username, email }) => {
  const response = await api.put("/users/profile", { username, email })
  return response.data
}

export const updateUserProfileAvatar = async ({ avatar }) => {
  const formData = new FormData()
  formData.append("avatar", avatar)

  const response = await api.put("/users/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

export const updateUserPersonalData = async ({
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

export const deleteEmployee = async ({ userId }) => {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}
