import React, { useState, Suspense } from "react"

import { useRepair } from "@hooks/server/useRepair"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { RepairEntryAccessoryTable, RepairEntryAccessoryAddModal } from "./components"

import { motion } from "framer-motion"

const RepairEntryAccessoryListPage = () => {
  const { findAllEntryAccessories } = useRepair()

  const [addRepairEntryAccessoryModal, setAddRepairEntryAccessoryModal] = useState(false)
  const openAddRepairEntryAccessoryModal = () => {
    setAddRepairEntryAccessoryModal(true)
  }
  const closeAddRepairEntryAccessoryModal = () => {
    setAddRepairEntryAccessoryModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Acessórios da Entrada"
              breadcrumbs={[
                { name: "Reparação", link: "/repair/list" },
                { name: "Acessório da entrada" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllEntryAccessories.isFetching}
              refetchFunction={() => findAllEntryAccessories.refetch()}
              isRefetching={
                findAllEntryAccessories.isRefetching && !findAllEntryAccessories.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Acessório da Entrada",
                onClick: () => openAddRepairEntryAccessoryModal()
              }}
            />
            <RepairEntryAccessoryTable />
            <RepairEntryAccessoryAddModal
              open={addRepairEntryAccessoryModal}
              onClose={closeAddRepairEntryAccessoryModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default RepairEntryAccessoryListPage
