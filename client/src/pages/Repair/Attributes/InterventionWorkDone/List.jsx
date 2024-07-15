import React, { useState, Suspense } from "react"

import { useRepair } from "@hooks/server/useRepair"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { RepairInterventionWorkDoneTable, RepairInterventionWorkDoneAddModal } from "./components"

import { motion } from "framer-motion"

const RepairInterventionWorkDoneListPage = () => {
  const { findAllInterventionWorksDone } = useRepair()

  const [addRepairInterventionWorkDoneModal, setAddRepairInterventionWorkDoneModal] =
    useState(false)
  const openAddRepairInterventionWorkDoneModal = () => {
    setAddRepairInterventionWorkDoneModal(true)
  }
  const closeAddRepairInterventionWorkDoneModal = () => {
    setAddRepairInterventionWorkDoneModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Trabalhos Realizados"
              breadcrumbs={[
                { name: "Reparação", link: "/repair/list" },
                { name: "Trabalhos Realizados" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllInterventionWorksDone.isFetching}
              refetchFunction={() => findAllInterventionWorksDone.refetch()}
              isRefetching={
                findAllInterventionWorksDone.isRefetching &&
                !findAllInterventionWorksDone.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Trabalho Realizado",
                onClick: () => openAddRepairInterventionWorkDoneModal()
              }}
            />
            <RepairInterventionWorkDoneTable />
            <RepairInterventionWorkDoneAddModal
              open={addRepairInterventionWorkDoneModal}
              onClose={closeAddRepairInterventionWorkDoneModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default RepairInterventionWorkDoneListPage
