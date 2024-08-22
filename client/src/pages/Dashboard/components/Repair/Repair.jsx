import React from "react"

import { Paper, Stack } from "@mui/material"
import { Construction } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"

import { RepairTable } from "./components"

const Repair = () => {
  return (
    <Paper elevation={1}>
      <Stack>
        <HeaderSection
          title="Reparações"
          description="Dados sobre as reparações existentes"
          icon={<Construction />}
        />
        <RepairTable />
      </Stack>
    </Paper>
  )
}

export default Repair
