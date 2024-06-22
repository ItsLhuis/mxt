import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EditClient } from "./components"

import { motion } from "framer-motion"

const EditClientPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{height: "100%"}}>
        <Box component="main" className="page-main" sx={{height: "100%"}}>
          <Container maxWidth={false} sx={{height: "100%"}}>
            <HeaderPage
              title="Editar Cliente"
              breadcrumbs={[{ name: "Cliente" }, { name: "Editar" }]}
            />
            <EditClient />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EditClientPage
