import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { InvoiceList, InvoiceStatus } from "./components"

import { motion } from "framer-motion"

const List = () => {
  const navigate = useNavigate()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Faturas"
              breadcrumbs={[{ name: "Faturação" }, { name: "Lista" }]}
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Criar Fatura",
                onClick: () => navigate("/invoice/add")
              }}
            />
            <InvoiceStatus />
            <InvoiceList />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default List
