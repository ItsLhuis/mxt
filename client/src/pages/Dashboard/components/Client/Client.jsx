import React from "react"

import { Paper, Stack } from "@mui/material"
import { Person } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"

import { ClientTable } from "./components"

const Client = () => {
  return (
    <Paper elevation={1}>
      <Stack>
        <HeaderSection
          title="Clientes"
          description="Dados sobre os clientes existentes"
          icon={<Person />}
        />
        <ClientTable />
      </Stack>
    </Paper>
  )
}

export default Client
