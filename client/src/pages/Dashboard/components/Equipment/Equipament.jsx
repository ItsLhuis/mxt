import React from "react"

import { Paper, Stack } from "@mui/material"
import { Computer } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"

import { EquipmentTable } from "./components"

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
      </Stack>
    </Paper>
  )
}

export default Equipament
