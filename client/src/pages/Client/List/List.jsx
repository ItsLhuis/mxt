import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { ClientList } from "./components"

import { motion } from "framer-motion"

const List = () => {
  const navigate = useNavigate()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Clientes"
              breadcrumbs={[{ name: "Cliente" }, { name: "Lista" }]}
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Cliente",
                onClick: () => navigate("/client/add")
              }}
            />
            <ClientList />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default List
