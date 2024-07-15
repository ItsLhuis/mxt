import React, { useState, Suspense } from "react"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EquipmentBrandTable, EquipmentBrandAddModal } from "./components"

import { motion } from "framer-motion"

const EquipmentBrandListPage = () => {
  const { findAllEquipmentBrands } = useEquipment()

  const [addEquipmentBrandModal, setAddEquipmentBrandModal] = useState(false)
  const openAddEquipmentBrandModal = () => {
    setAddEquipmentBrandModal(true)
  }
  const closeAddEquipmentBrandModal = () => {
    setAddEquipmentBrandModal(false)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Marcas"
              breadcrumbs={[
                { name: "Equipamento", link: "/equipment/list" },
                { name: "Marca" },
                { name: "Lista" }
              ]}
              isRefetchEnable={!findAllEquipmentBrands.isFetching}
              refetchFunction={() => findAllEquipmentBrands.refetch()}
              isRefetching={
                findAllEquipmentBrands.isRefetching && !findAllEquipmentBrands.isRefetchError
              }
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Marca",
                onClick: () => openAddEquipmentBrandModal()
              }}
            />
            <EquipmentBrandTable />
            <EquipmentBrandAddModal
              open={addEquipmentBrandModal}
              onClose={closeAddEquipmentBrandModal}
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EquipmentBrandListPage
