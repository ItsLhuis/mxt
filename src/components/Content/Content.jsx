import React from "react"

import "./styles.css"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"


import { AnimatePresence } from "framer-motion"

const Content = ({ showHeader }) => {
  const location = useLocation()

  return (
      <div className="main-content">
        <div className="all-content">
          <AnimatePresence>
            {/* <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate replace to="/dashboards/analytics" />} />

              <Route
                path="/dashboards/analytics"
                element={<DashboardAnalytics showHeader={showHeader} />}
              />
              <Route
                path="/dashboards/commerce"
                element={<DashboardCommerce showHeader={showHeader} />}
              />
              <Route path="/dashboards/crm" element={<DashboardCRM showHeader={showHeader} />} />

              <Route path="/pages/login" element={<Login />} />
              <Route path="/pages/register" element={<Register />} />
              <Route path="/pages/forgot-password" element={<ForgotPassword />} />

              <Route path="/applications/chat" element={<Chat showHeader={showHeader} />} />
              <Route path="/applications/contacts" element={<Contacts showHeader={showHeader} />} />
              <Route path="/applications/mailbox" element={<Mailbox showHeader={showHeader} />} />
            </Routes> */}
          </AnimatePresence>
        </div>
      </div>
  )
}

export default Content
