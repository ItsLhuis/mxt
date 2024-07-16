import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { AddRepairForm } from "./components"

import { motion } from "framer-motion"

const AddRepairPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Adicionar Reparação"
              breadcrumbs={[{ name: "Reparação", link: "/repair/list" }, { name: "Adicionar" }]}
            />
            <AddRepairForm />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default AddRepairPage
