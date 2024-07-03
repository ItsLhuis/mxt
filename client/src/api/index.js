import axios from "axios"

//const BASE_URL = `${window.location.origin}/api/v1`
const BASE_URL = "http://localhost:8080/api/v1"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

import { refreshToken, logout } from "@api/routes/auth"

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    //User account is not active
    if (error.response.data.error.code && error.response.data.error.code === "USR-016") {
      await logout().then(() => window.location.reload())
    }

    //Access token is not valid
    if (
      error.response.data.error.code &&
      (error.response.data.error.code === "USR-007" ||
        error.response.data.error.code === "USR-008") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      await refreshToken()

      return api(originalRequest)
    }

    const errorMessage = error.response?.data || "An unexpected error occurred."
    return Promise.reject(errorMessage)
  }
)

export { api, BASE_URL }
