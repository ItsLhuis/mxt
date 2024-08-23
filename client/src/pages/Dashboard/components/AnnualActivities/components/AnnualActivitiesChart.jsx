import React from "react"

import { Box, Skeleton, Stack } from "@mui/material"

import { ButtonDropDownSelect, ListButton, Loadable } from "@components/ui"
import { LineChart } from "@components/ui/Charts"

const AnnualActivitiesChart = () => {
  const data = [
    {
      name: "Funcionários",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200))
    },
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
    },
    {
      name: "E-mails",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 600))
    },
    {
      name: "SMS",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 600))
    }
  ]

  const colors = [
    "rgb(248, 112, 96)",
    "rgb(92, 107, 192)",
    "rgb(139, 195, 74)",
    "rgb(255, 152, 0)",
    "rgb(33, 150, 243)",
    "rgb(255, 87, 34)"
  ]

  return (
    <Box sx={{ width: "100%", padding: 3, paddingTop: 0 }}>
      <Stack sx={{ marginBlock: 1, alignItems: "flex-end" }}>
        <Loadable
          isLoading={false}
          LoadingComponent={<Skeleton variant="rounded" height={41} width={87} />}
          LoadedComponent={
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
          }
        />
      </Stack>
      <Box sx={{ width: "100%", minHeight: 500 }}>
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
  )
}

export default AnnualActivitiesChart
