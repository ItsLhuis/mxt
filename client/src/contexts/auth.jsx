import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { useLoader } from "@contexts/loader"

import { getUserProfile, getUserById } from "@api/routes/user"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const { showLoader, hideLoader } = useLoader()

  const [isAuth, setIsAuth] = useState(false)
  const [isAuthCompany, setIsAuthCompany] = useState(false)
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuthStatus = () => {
    setIsLoading(true)

    getUserProfile()
      .then((data) => {
        setRole(data.role)
        setIsAuth(!!data)
        getUserById({ userId: data.id })
          .then(() => setIsAuthCompany(false))
          .catch((error) => {
            if (error.error.code === "COMP-001") {
              navigate("/company")
              setIsAuthCompany(true)
              return
            }

            setIsAuth(false)
          })
      })
      .catch(() => {
        setIsAuth(false)
      })
      .finally(() => setTimeout(() => setIsLoading(false), 200))
  }

  useLayoutEffect(() => {
    fetchAuthStatus()
  }, [])

  useEffect(() => {
    isLoading ? showLoader() : hideLoader()
  }, [isLoading])

  const reloadAuthStatus = () => {
    fetchAuthStatus()
  }

  const value = {
    isAuth,
    isAuthCompany,
    role,
    isLoading,
    reloadAuthStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) throw new Error("useAuth must be used within a AuthProvider")

  return context
}
