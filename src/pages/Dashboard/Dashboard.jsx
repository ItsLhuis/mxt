import React from "react"

import { Box, Container } from "@mui/material"

import { HeaderPage } from "@components/ui"

import { motion } from "framer-motion"

const Dashboard = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Box component="main" className="page-main">
        <Container maxWidth={false}>
          <HeaderPage title="Painel de Controlo" breadcrumbs={[{ name: "Painel de Controlo" }]} />
        </Container>
      </Box>
    </motion.div>
  )
}

export default Dashboard
