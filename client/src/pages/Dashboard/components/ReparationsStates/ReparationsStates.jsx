import React from "react"

import { Paper, Typography, Box } from "@mui/material"

import { PieChart } from "@components/ui/Charts"

const ReparationsStates = () => {
  const data = Array.from({ length: 4 }, () => Math.floor(Math.random() * 2000))
  const labels = ["Abertos", "Reparados", "Fechados", "DC"]
  const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560"]

  return (
    <Paper elevation={1} sx={{ height: "100%" }}>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" component="h5" sx={{ marginBottom: 3 }}>
          Estados Reparações
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <PieChart data={data} labels={labels} colors={colors} />
        </Box>
      </Box>
    </Paper>
  )
}

export default ReparationsStates
