import React, { useState, Suspense } from "react"

import { useRepair } from "@hooks/server/useRepair"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { RepairStatusTable, RepairStatusAddModal } from "./components"

import { motion } from "framer-motion"

const RepairStatusListPage = () => {
  const { findAllRepairStatuses } = useRepair()

  const [addRepairStatusModal, setAddRepairStatusModal] = useState(false)
  const openAddRepairStatusModal = () => {
    setAddRepairStatusModal(true)
  }
  const closeAddRepairStatusModal = () => {
    setAddRepairStatusModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Estados"
              breadcrumbs={[
                { name: "Reparação", link: "/repair/list" },
                { name: "Estado" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllRepairStatuses.isFetching}
              refetchFunction={() => findAllRepairStatuses.refetch()}
              isRefetching={
                findAllRepairStatuses.isRefetching && !findAllRepairStatuses.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Estado",
                onClick: () => openAddRepairStatusModal()
              }}
            />
            <RepairStatusTable />
            <RepairStatusAddModal open={addRepairStatusModal} onClose={closeAddRepairStatusModal} />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default RepairStatusListPage
