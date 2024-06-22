import React from "react"

import { Paper, Box } from "@mui/material"

import ClientContactTable from "./ClientContactTable"
import ClientContactForm from "./ClientContactForm"

const ClientContact = ({ client, isLoading, isError }) => {
  return (
    <Paper elevation={1}>
      <ClientContactTable client={client} isLoading={isLoading} isError={isError} />
      <ClientContactForm client={client} isLoading={isLoading} isError={isError} />
    </Paper>
  )
}

export default ClientContact
