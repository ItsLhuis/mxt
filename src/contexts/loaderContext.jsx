import React, { createContext, useContext, useState } from "react"

const LoaderContext = createContext()

export const LoaderProvider = ({ children, ...props }) => {
  const [loader, setLoader] = useState(false)

  const showLoader = () => setLoader(true)
  const hideLoader = () => setLoader(false)

  const value = {
    loader,
    showLoader,
    hideLoader
  }

  return (
    <LoaderContext.Provider {...props} value={value}>
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoader = () => {
  const context = useContext(LoaderContext)

  if (context === undefined) throw new Error("useLoad must be used within a LoaderProvider")

  return context
}
