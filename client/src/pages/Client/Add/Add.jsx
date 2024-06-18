import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage, RichEditor } from "@components/ui"

import { motion } from "framer-motion"

const Add = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Adicionar Cliente"
              breadcrumbs={[{ name: "Cliente" }, { name: "Adicionar" }]}
            />
            <Box marginBlock={3}>
              <RichEditor />
            </Box>
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default Add
