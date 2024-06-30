import React, { Suspense, useEffect } from "react"

import { useLoader } from "@contexts/loader"

import { Box, Container, Grid, Paper } from "@mui/material"

import { PageLoader, HeaderPage, FileUpload } from "@components/ui"
import { AnnualActivities, FinancialStatistics, Summary, ReparationsStates } from "./components"

import { motion } from "framer-motion"

const Dashboard = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage title="Painel de Controlo" breadcrumbs={[{ name: "Painel de Controlo" }]} />
            <Paper elevation={1} sx={{ marginTop: 3, padding: 3 }}>
              <FileUpload />
            </Paper>
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default Dashboard
