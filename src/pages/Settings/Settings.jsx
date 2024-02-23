import React from "react"

import { Box, Container, Typography } from "@mui/material"

import { motion } from "framer-motion"

const Settings = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Box component="main" className="page-main">
        <Container maxWidth={false}>
          <Box>
            <Typography variant="h4" component="h4">
              Definições de Utilizador
            </Typography>
          </Box>
        </Container>
      </Box>
    </motion.div>
  )
}

export default Settings
