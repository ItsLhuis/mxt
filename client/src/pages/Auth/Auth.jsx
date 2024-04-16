import React, { Suspense } from "react"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { PageProgress } from "@components/ui"

import { Login } from "./components"

const Auth = () => {
  const location = useLocation()

  return (
    <Suspense fallback={<PageProgress />}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate replace to="/auth/login" />} />
        <Route path="/auth" element={<Navigate replace to="/auth/login" />} />

        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default Auth
