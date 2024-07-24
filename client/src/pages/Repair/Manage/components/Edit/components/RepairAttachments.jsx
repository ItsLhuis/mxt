import React from "react"

import { Paper } from "@mui/material"

import RepairAttachmentsTable from "./RepairAttachmentsTable"
import RepairAttachmentsForm from "./RepairAttachmentsForm"

const RepairAttachments = ({ repair, isLoading, isError }) => {
  return (
    <Paper elevation={1}>
      <RepairAttachmentsTable repair={repair} isLoading={isLoading} isError={isError} />
      <RepairAttachmentsForm repair={repair} isLoading={isLoading} isError={isError} />
    </Paper>
  )
}

export default RepairAttachments
