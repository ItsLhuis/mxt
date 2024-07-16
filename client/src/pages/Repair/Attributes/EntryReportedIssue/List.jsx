import React, { useState, Suspense } from "react"

import { useRepair } from "@hooks/server/useRepair"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { RepairEntryReportedIssueTable, RepairEntryReportedIssueAddModal } from "./components"

import { motion } from "framer-motion"

const RepairEntryReportedIssueListPage = () => {
  const { findAllEntryReportedIssues } = useRepair()

  const [addRepairEntryReportedIssueModal, setAddRepairEntryReportedIssueModal] = useState(false)
  const openAddRepairEntryReportedIssueModal = () => {
    setAddRepairEntryReportedIssueModal(true)
  }
  const closeAddRepairEntryReportedIssueModal = () => {
    setAddRepairEntryReportedIssueModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Problemas reportados"
              breadcrumbs={[
                { name: "Reparação", link: "/repair/list" },
                { name: "Problema Reportado" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllEntryReportedIssues.isFetching}
              refetchFunction={() => findAllEntryReportedIssues.refetch()}
              isRefetching={
                findAllEntryReportedIssues.isRefetching && !findAllEntryReportedIssues.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Problema Reportado",
                onClick: () => openAddRepairEntryReportedIssueModal()
              }}
            />
            <RepairEntryReportedIssueTable />
            <RepairEntryReportedIssueAddModal
              open={addRepairEntryReportedIssueModal}
              onClose={closeAddRepairEntryReportedIssueModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default RepairEntryReportedIssueListPage
