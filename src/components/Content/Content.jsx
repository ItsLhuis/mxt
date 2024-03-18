import React, { Suspense } from "react"

import "./styles.css"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { PageProgress } from "@components/ui"

import { Dashboard, InvoiceList, CreateInvoice, Settings } from "@pages"

const Content = () => {
  const location = useLocation()

  return (
    <div className="main-content">
      <div className="all-content">
        <Suspense fallback={<PageProgress />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/invoice/list" element={<InvoiceList />} />
            <Route path="/invoice/add" element={<CreateInvoice />} />

            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default Content
