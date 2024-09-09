import React from "react"

import { Paper, Stack } from "@mui/material"
import { QueryStats } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"

import { AnnualActivitiesChart } from "./components"

const AnnualActivities = ({ toggleActivityYear }) => {
  return (
    <Paper elevation={1}>
      <Stack>
        <HeaderSection
          title="Atividades Anuais"
          description="Gráfico das atividades anuais"
          icon={<QueryStats />}
        />
        <AnnualActivitiesChart toggleActivityYear={toggleActivityYear} />
      </Stack>
    </Paper>
  )
}

export default AnnualActivities
