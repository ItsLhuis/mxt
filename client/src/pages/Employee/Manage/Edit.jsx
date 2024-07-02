import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EditEmployee } from "./components"

import { motion } from "framer-motion"

const EditEmployeePage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ height: "100%" }}
      >
        <Box component="main" className="page-main" sx={{ height: "100%" }}>
          <Container maxWidth={false} sx={{ height: "100%" }}>
            <HeaderPage
              title="Editar Funcionário"
              breadcrumbs={[{ name: "Funcionário", link: "/employee/list" }, { name: "Editar" }]}
            />
            <EditEmployee />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EditEmployeePage
