import { api } from ".."

const login = async ({ username, password }) => {
  const response = await api.post("/auth/login", { username, password })
  return response.data
}

const refreshToken = async () => {
  const response = await api.post("/auth/refreshToken")
  return response.data
}

const logout = async () => {
  const response = await api.delete("/auth/logout")
  return response.data
}

const requestPasswordReset = async ({ email }) => {
  const response = await api.post("/auth/resetPassword/request", { email })
  return response.data
}

const verifyPasswordResetToken = async (token) => {
  const response = await api.post(`/auth/resetPassword/verify/${token}`)
  return response.data
}

const confirmPasswordReset = async (token, { newPassword, confirmPassword }) => {
  const response = await api.post(`/auth/resetPassword/confirm/${token}`, {
    newPassword,
    confirmPassword
  })
  return response.data
}

export {
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  verifyPasswordResetToken,
  confirmPasswordReset
}
