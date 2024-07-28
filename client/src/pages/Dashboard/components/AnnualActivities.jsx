import React from "react"

import { Paper, Typography, Box, Stack } from "@mui/material"

import { ButtonDropDownSelect, ListButton, HeaderSection } from "@components/ui"
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
    <>
      <HeaderSection title="Gráfico Anual" description="Gráfico anual dos equipamentos" />
      <Box sx={{ width: "100%", padding: 3, paddingTop: 0 }}>
        <Stack sx={{marginBlock: 1, alignItems: "flex-end"}}>
          <ButtonDropDownSelect title="2024">
            <ListButton
              buttons={[
                { label: "2024", onClick: () => console.log() },
                { label: "2023", onClick: () => console.log() },
                { label: "2022", onClick: () => console.log() },
                { label: "2021", onClick: () => console.log() },
                { label: "2020", onClick: () => console.log() },
                { label: "2019", onClick: () => console.log() }
              ]}
            />
          </ButtonDropDownSelect>
        </Stack>
        <Box sx={{ width: "100%", minHeight: 400 }}>
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
    </>
  )
}

export default OverallChart
