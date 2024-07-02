import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { useClient } from "@hooks/server/useClient"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { ClientTable } from "./components"

import { motion } from "framer-motion"

const ClientListPage = () => {
  const navigate = useNavigate()

  const { findAllClients } = useClient()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Clientes"
              breadcrumbs={[{ name: "Cliente" }, { name: "Lista" }]}
              isRefetchEnable={!findAllClients.isFetching}
              refetchFunction={() => findAllClients.refetch()}
              isRefetching={findAllClients.isRefetching && !findAllClients.isRefetchError}
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Cliente",
                onClick: () => navigate("/client/add")
              }}
            />
            <ClientTable />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default ClientListPage
