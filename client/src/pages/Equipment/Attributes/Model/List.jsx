import React, { useState, Suspense } from "react"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EquipmentModelTable, EquipmentModelAddModal } from "./components"

import { motion } from "framer-motion"

const EquipmentModelListPage = () => {
  const { findAllEquipmentModels } = useEquipment()

  const [addEquipmentModelModal, setAddEquipmentModelModal] = useState(false)
  const openAddEquipmentModelModal = () => {
    setAddEquipmentModelModal(true)
  }
  const closeAddEquipmentModelModal = () => {
    setAddEquipmentModelModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Modelos"
              breadcrumbs={[
                { name: "Equipamento", link: "/equipment/list" },
                { name: "Modelo" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllEquipmentModels.isFetching}
              refetchFunction={() => findAllEquipmentModels.refetch()}
              isRefetching={
                findAllEquipmentModels.isRefetching && !findAllEquipmentModels.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Modelo",
                onClick: () => openAddEquipmentModelModal()
              }}
            />
            <EquipmentModelTable />
            <EquipmentModelAddModal
              open={addEquipmentModelModal}
              onClose={closeAddEquipmentModelModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EquipmentModelListPage
