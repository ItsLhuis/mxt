import React, { useState, Suspense } from "react"

import { useRepair } from "@hooks/server/useRepair"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import {
  RepairInterventionAccessoryUsedTable,
  RepairInterventionAccessoryUsedAddModal
} from "./components"

import { motion } from "framer-motion"

const RepairInterventionAccessoryUsedListPage = () => {
  const { findAllInterventionAccessoriesUsed } = useRepair()

  const [addRepairInterventionAccessoryUsedModal, setAddRepairInterventionAccessoryUsedModal] =
    useState(false)
  const openAddRepairInterventionAccessoryUsedModal = () => {
    setAddRepairInterventionAccessoryUsedModal(true)
  }
  const closeAddRepairInterventionAccessoryUsedModal = () => {
    setAddRepairInterventionAccessoryUsedModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Acessórios da Intervenção"
              breadcrumbs={[
                { name: "Reparação", link: "/repair/list" },
                { name: "Acessório da Intervenção" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllInterventionAccessoriesUsed.isFetching}
              refetchFunction={() => findAllInterventionAccessoriesUsed.refetch()}
              isRefetching={
                findAllInterventionAccessoriesUsed.isRefetching &&
                !findAllInterventionAccessoriesUsed.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Acessório da Intervenção",
                onClick: () => openAddRepairInterventionAccessoryUsedModal()
              }}
            />
            <RepairInterventionAccessoryUsedTable />
            <RepairInterventionAccessoryUsedAddModal
              open={addRepairInterventionAccessoryUsedModal}
              onClose={closeAddRepairInterventionAccessoryUsedModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default RepairInterventionAccessoryUsedListPage
