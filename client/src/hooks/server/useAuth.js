import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useNavigate } from "react-router-dom"

import { login as loginApi, logout as logoutApi } from "@api/routes/auth"

import { useAuth as useAuthContext } from "@contexts/auth"

export const useAuth = () => {
  const navigate = useNavigate()

  const { reloadAuthStatus } = useAuthContext()

  const queryClient = useQueryClient()

  const login = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      reloadAuthStatus()
      queryClient.invalidateQueries(["userProfile"])
      queryClient.setQueryData(["userProfile"], data[0])
      navigate("/")
    }
  })

  const logout = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      reloadAuthStatus()
      queryClient.invalidateQueries(["userProfile"])
      navigate("/auth/login")
    }
  })

  return { login, logout }
}
