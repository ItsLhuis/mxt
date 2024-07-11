import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { useRepair } from "@hooks/server/useRepair"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { RepairTable } from "./components"

import { motion } from "framer-motion"

const RepairtListPage = () => {
  const navigate = useNavigate()

  const { findAllRepairs } = useRepair()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Reparações"
              breadcrumbs={[{ name: "Reparação" }, { name: "Lista" }]}
              isRefetchEnable={!findAllRepairs.isFetching}
              refetchFunction={() => findAllRepairs.refetch()}
              isRefetching={findAllRepairs.isRefetching && !findAllRepairs.isRefetchError}
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Reparação",
                onClick: () => navigate("/repair/add")
              }}
            />
            <RepairTable />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default RepairtListPage
