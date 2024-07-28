import React from "react"

import { Divider, Paper, Stack } from "@mui/material"
import { Computer } from "@mui/icons-material"

import { HeaderSection } from "@/components/ui"

import { EquipmentTable, EquipmentAnnualChart } from "./components"

const Equipament = () => {
  return (
    <Paper elevation={1}>
      <Stack>
        <HeaderSection
          title="Equipamentos"
          description="Dados sobre os equipamentos existentes"
          icon={<Computer />}
        />
        <EquipmentTable />
        <Divider
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <EquipmentAnnualChart />
      </Stack>
    </Paper>
  )
}

export default Equipament
