import React, { Suspense, useEffect } from "react"

import { useLoader } from "@contexts/loader"

import { Box, Container, Grid } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { AnnualActivities, FinancialStatistics, Summary, ReparationsStates } from "./components"

import { motion } from "framer-motion"

const Dashboard = () => {
  const { hideLoader } = useLoader()

  useEffect(() => {
    setTimeout(() => {
      hideLoader()
    }, 1000)
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage title="Painel de Controlo" breadcrumbs={[{ name: "Painel de Controlo" }]} />
{/*             <Summary />
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={8}>
                <AnnualActivities />
              </Grid>
              <Grid item xs={12} md={12} lg={4}>
                <ReparationsStates />
              </Grid>
            </Grid>
            <Box sx={{ paddingTop: 3 }}>
              <FinancialStatistics />
            </Box> */}
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default Dashboard
