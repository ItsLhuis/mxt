import React, { Suspense } from "react"

import "./styles.css"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { PageProgress } from "@components/ui"

import { Dashboard, Settings } from "@pages"

import { AnimatePresence } from "framer-motion"

const Content = () => {
  const location = useLocation()

  return (
    <div className="main-content">
      <div className="all-content">
        <Suspense fallback={<PageProgress />}>
          <AnimatePresence>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate replace to="/dashboard" />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  )
}

export default Content
