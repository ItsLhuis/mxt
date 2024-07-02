import { api } from ".."

export const login = async ({ username, password }) => {
  const response = await api.post("/auth/login", { username, password })
  return response.data
}

export const refreshToken = async () => {
  const response = await api.post("/auth/refreshToken")
  return response.data
}

export const logout = async () => {
  const response = await api.delete("/auth/logout")
  return response.data
}

export const requestPasswordReset = async ({ email }) => {
  const response = await api.post("/auth/resetPassword/request", { email })
  return response.data
}

export const verifyPasswordResetToken = async (token) => {
  const response = await api.post(`/auth/resetPassword/verify/${token}`)
  return response.data
}

export const confirmPasswordReset = async (token, { newPassword, confirmPassword }) => {
  const response = await api.post(`/auth/resetPassword/confirm/${token}`, {
    newPassword,
    confirmPassword
  })
  return response.data
}
