import { api } from ".."

export const login = async ({ username, password }) => {
  const response = await api.post("/auth/login", { username, password })
  return response.data
}

export const requestResetPassword = async ({ email }) => {
  const response = await api.post("/auth/reset-password/request", { email })
  return response.data
}

export const verifyResetPassword = async ({ token, otp }) => {
  const response = await api.post(`/auth/reset-password/verify/${token}`, { otp })
  return response.data
}

export const confirmResetPassword = async ({ token, newPassword, confirmPassword }) => {
  const response = await api.post(`/auth/reset-password/confirm/${token}`, {
    newPassword,
    confirmPassword
  })
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
