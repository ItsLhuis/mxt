import React from "react"

import { Paper, Typography, Box, Stack } from "@mui/material"

import { ButtonDropDownSelect, ListButton } from "@components/ui"
import { LineChart } from "@components/ui/Charts"

const OverallChart = () => {
  const data = [
    {
      name: "Clientes",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200))
    },
    {
      name: "Equipamentos",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 400))
    },
    {
      name: "Reparações",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 600))
    }
  ]

  const colors = ["rgb(248, 112, 96)", "rgb(165, 170, 82)", "rgb(124, 152, 179)"]

  return (
    <Paper elevation={1} sx={{ height: "100%" }}>
      <Box sx={{ padding: 3 }}>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Typography variant="h5" component="h5" sx={{ marginBottom: 3 }}>
            Atividades Anuais
          </Typography>
          <Box>
            <ButtonDropDownSelect title="2024">
              <ListButton
                buttons={[
                  { title: "2024", action: () => console.log() },
                  { title: "2023", action: () => console.log() },
                  { title: "2022", action: () => console.log() },
                  { title: "2021", action: () => console.log() },
                  { title: "2020", action: () => console.log() },
                  { title: "2019", action: () => console.log() }
                ]}
              />
            </ButtonDropDownSelect>
          </Box>
        </Stack>
        <Box sx={{ width: "100%", height: 400 }}>
          <LineChart
            data={data}
            categories={[
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez"
            ]}
            limits={[1, 12]}
            colors={colors}
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default OverallChart
