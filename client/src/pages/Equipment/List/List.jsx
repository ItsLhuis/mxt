import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EquipmentTable } from "./components"

import { motion } from "framer-motion"

const EquipmentListPage = () => {
  const navigate = useNavigate()

  const { findAllEquipments } = useEquipment()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Equipamentos"
              breadcrumbs={[{ name: "Equipamento" }, { name: "Lista" }]}
              isRefetchEnable={!findAllEquipments.isFetching}
              refetchFunction={() => findAllEquipments.refetch()}
              isRefetching={findAllEquipments.isRefetching && !findAllEquipments.isRefetchError}
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Equipamento",
                onClick: () => navigate("/equipment/add")
              }}
            />
            <EquipmentTable />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EquipmentListPage
