import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useNavigate } from "react-router-dom"

import {
  login as loginApi,
  requestResetPassword as requestResetPasswordApi,
  verifyResetPassword as verifyResetPasswordApi,
  confirmResetPassword as confirmResetPasswordApi,
  logout as logoutApi
} from "@api/routes/auth"

import { useAuth as useAuthContext } from "@contexts/auth"

export const useAuth = () => {
  const navigate = useNavigate()

  const { reloadAuthStatus } = useAuthContext()

  const queryClient = useQueryClient()

  const login = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      reloadAuthStatus()
      queryClient.setQueryData(["userProfile"], data[0])
      navigate("/")
    }
  })

  const requestResetPassword = useMutation({
    mutationFn: requestResetPasswordApi
  })

  const verifyResetPassword = useMutation({
    mutationFn: verifyResetPasswordApi
  })

  const confirmResetPassword = useMutation({
    mutationFn: confirmResetPasswordApi
  })

  const logout = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      reloadAuthStatus()
      queryClient.removeQueries(["userProfile"])
      navigate("/auth/login")
    }
  })

  return { login, requestResetPassword, verifyResetPassword, confirmResetPassword, logout }
}
