import React from "react"

import { Paper } from "@mui/material"

import ClientAddressTable from "./ClientAddressTable"
import ClientAddressForm from "./ClientAddressForm"

const ClientAddress = ({ client, isLoading, isError }) => {
  return (
    <Paper elevation={1}>
      <ClientAddressTable client={client} isLoading={isLoading} isError={isError} />
      <ClientAddressForm client={client} isLoading={isLoading} isError={isError} />
    </Paper>
  )
}

export default ClientAddress
