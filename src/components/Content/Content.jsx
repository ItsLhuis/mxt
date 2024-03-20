import React, { Suspense, useEffect, useRef } from "react"

import "./styles.css"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { PageProgress } from "@components/ui"

import { Dashboard, InvoiceList, CreateInvoice, Settings } from "@pages"

const Content = () => {
  const location = useLocation()

  const allContentRef = useRef(null)

  useEffect(() => {
    if (allContentRef.current) {
      allContentRef.current.scrollTo(0, 0)
    }
  }, [location])

  return (
    <div className="main-content">
      <div className="all-content" ref={allContentRef}>
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
