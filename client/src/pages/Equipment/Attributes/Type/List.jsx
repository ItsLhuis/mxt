import React, { useState, Suspense } from "react"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EquipmentTypeTable, EquipmentTypeAddModal } from "./components"

import { motion } from "framer-motion"

const EquipmentTypeListPage = () => {
  const { findAllEquipmentTypes } = useEquipment()

  const [addEquipmentTypeModal, setAddEquipmentTypeModal] = useState(false)
  const openAddEquipmentTypeModal = () => {
    setAddEquipmentTypeModal(true)
  }
  const closeAddEquipmentTypeModal = () => {
    setAddEquipmentTypeModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Tipos"
              breadcrumbs={[
                { name: "Equipamento", link: "/equipment/list" },
                { name: "Tipo" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllEquipmentTypes.isFetching}
              refetchFunction={() => findAllEquipmentTypes.refetch()}
              isRefetching={
                findAllEquipmentTypes.isRefetching && !findAllEquipmentTypes.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Tipo",
                onClick: () => openAddEquipmentTypeModal()
              }}
            />
            <EquipmentTypeTable />
            <EquipmentTypeAddModal
              open={addEquipmentTypeModal}
              onClose={closeAddEquipmentTypeModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EquipmentTypeListPage
