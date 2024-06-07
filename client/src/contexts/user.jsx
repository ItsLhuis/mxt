import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from "react"

import { useLoader } from "@/contexts/loader"

import { getUserProfile } from "@api/routes/user"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { showLoader, hideLoader } = useLoader()

  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  const fetchUser = () => {
    setIsLoadingUser(true)

    getUserProfile()
      .then((data) => setUser(data[0]))
      .catch(() => {
        setUser(null)
        setIsLoadingUser(false)
      })
      .finally(() => setIsLoadingUser(false))
  }

  useLayoutEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (isLoadingUser) {
      showLoader()
    } else {
      hideLoader()
    }
  }, [isLoadingUser])

  const updateUserProfile = () => {
    fetchUser()
  }

  const deleteUser = () => {
    setIsLoadingUser(true)
    setUser(null)
    
    showLoader()

    setTimeout(() => {
      setIsLoadingUser(false)
      hideLoader()
    }, 300)
  }

  const value = {
    user,
    isLoadingUser,
    reloadUser: updateUserProfile,
    deleteUser
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
export const useUser = () => useContext(UserContext)
