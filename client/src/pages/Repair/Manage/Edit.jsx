import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EditRepair } from "./components"

import { motion } from "framer-motion"

const EditRepairPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Editar Reparação"
              breadcrumbs={[{ name: "Reparação", link: "/repair/list" }, { name: "Editar" }]}
            />
            <EditRepair />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EditRepairPage
