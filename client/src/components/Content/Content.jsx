import React, { Suspense, useEffect, useRef } from "react"

import "./styles.css"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { Box } from "@mui/material"

import { PageLoader } from "@components/ui"

import {
  Dashboard,
  EmployeeList,
  AddEmployee,
  EditEmployee,
  ClientList,
  AddClient,
  EditClient,
  EquipmentList,
  AddEquipment,
  EditEquipment,
  EquipmentTypeList,
  EquipmentBrandList,
  EquipmentModelList,
  RepairList,
  RepairStatusList,
  RepairEntryAccessoryList,
  RepairEntryReportedIssueList,
  RepairInterventionWorkDoneList,
  RepairInterventionAccessoryUsedList,
  EmailList,
  SendEmail,
  GetEmail,
  Settings
} from "@pages"

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
            <Route path="/auth/*" element={<Navigate to="/dashboard" replace />} />

            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Employee */}
            <Route path="/employee/list" element={<EmployeeList />} />
            <Route path="/employee/add" element={<AddEmployee />} />
            <Route path="/employee/:employeeId" element={<EditEmployee />} />
            {/* ---------------------------------------------------------- */}

            {/* Client */}
            <Route path="/client/list" element={<ClientList />} />
            <Route path="/client/add" element={<AddClient />} />
            <Route path="/client/:clientId" element={<EditClient />} />
            {/* ---------------------------------------------------------- */}

            {/* Equipment */}
            <Route path="/equipment/list" element={<EquipmentList />} />
            <Route path="/equipment/add" element={<AddEquipment />} />
            <Route path="/equipment/:equipmentId" element={<EditEquipment />} />

            <Route path="/equipment/type/list" element={<EquipmentTypeList />} />

            <Route path="/equipment/brand/list" element={<EquipmentBrandList />} />

            <Route path="/equipment/model/list" element={<EquipmentModelList />} />
            {/* ---------------------------------------------------------- */}

            {/* Repair */}
            <Route path="/repair/list" element={<RepairList />} />

            <Route path="/repair/status/list" element={<RepairStatusList />} />

            <Route path="/repair/entry-accessory/list" element={<RepairEntryAccessoryList />} />

            <Route path="/repair/reported-issue/list" element={<RepairEntryReportedIssueList />} />

            <Route path="/repair/work-done/list" element={<RepairInterventionWorkDoneList />} />

            <Route
              path="/repair/intervention-accessory/list"
              element={<RepairInterventionAccessoryUsedList />}
            />
            {/* ---------------------------------------------------------- */}

            {/* Email */}
            <Route path="/email/list" element={<EmailList />} />
            <Route path="/email/send" element={<SendEmail />} />
            <Route path="/email/:emailId" element={<GetEmail />} />
            {/* ---------------------------------------------------------- */}

            <Route path="/settings" element={<Settings />} />

            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  )
}

export default Content
