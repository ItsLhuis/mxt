import React, { useState, memo, Suspense } from "react"

import { useDashboard } from "@hooks/server/useDashboard"

import { Box, Container, Stack } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { Summary, AnnualActivities, Client, Equipment, Repair } from "./components"

import { motion } from "framer-motion"

const MemoSummary = memo(Summary)
const MemoAnnualActivities = memo(AnnualActivities)
const MemoClient = memo(Client)
const MemoEquipment = memo(Equipment)
const MemoRepair = memo(Repair)

const Dashboard = () => {
  const [activityYear, setActivityYear] = useState(new Date().getFullYear())
  const toggleActivityYear = (year) => {
    setActivityYear(year)
  }

  const { refetchAllQueries } = useDashboard(activityYear)

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Painel de Controlo"
              breadcrumbs={[{ name: "Painel de Controlo" }]}
              isRefetchEnable={!refetchAllQueries.isFetching}
              refetchFunction={() => refetchAllQueries.refetch()}
              isRefetching={refetchAllQueries.isRefetching}
            />
            <Stack sx={{ gap: 3 }}>
              <MemoSummary />
              <MemoAnnualActivities toggleActivityYear={toggleActivityYear} />
              <MemoClient />
              <MemoEquipment />
              <MemoRepair />
            </Stack>
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default Dashboard
