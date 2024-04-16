import React, { Suspense, useEffect, useRef } from "react"

import "./styles.css"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { Box } from "@mui/material"

import { PageLoader } from "@components/ui"

import { Dashboard, ClientList, AddClient, InvoiceList, CreateInvoice, Settings } from "@pages"

const Content = () => {
  const location = useLocation()

  const allContentRef = useRef(null)

  useEffect(() => {
    if (allContentRef.current) {
      allContentRef.current.scrollTo(0, 0)
    }
  }, [location])

  return (
    <Box className="main-content">
      <Box className="all-content" ref={allContentRef}>
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />

            <Route path="/dashboard" element={<Dashboard />} />

            {/* Client */}
            <Route path="/client/list" element={<ClientList />} />
            <Route path="/client/add" element={<AddClient />} />
            {/* ---------------------------------------------------------- */}

            {/* Invoice */}
            <Route path="/invoice/list" element={<InvoiceList />} />
            <Route path="/invoice/add" element={<CreateInvoice />} />
            {/* ---------------------------------------------------------- */}

            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  )
}

export default Content
