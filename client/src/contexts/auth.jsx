import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from "react"

import { useLoader } from "@contexts/loader"

import { getUserProfile } from "@api/routes/user"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const { showLoader, hideLoader } = useLoader()

  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuthStatus = () => {
    setIsLoading(true)

    getUserProfile()
      .then((data) => setIsAuth(!!data))
      .catch(() => {
        setIsAuth(false)
      })
      .finally(() => setIsLoading(false))
  }

  useLayoutEffect(() => {
    fetchAuthStatus()
  }, [])

  useEffect(() => {
    isLoading ? showLoader() : hideLoader();
  }, [isLoading]);

  const reloadAuthStatus = () => {
    fetchAuthStatus()
  }

  const value = {
    isAuth,
    isLoading,
    reloadAuthStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
