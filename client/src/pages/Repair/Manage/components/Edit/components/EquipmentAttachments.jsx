import React from "react"

import { Paper } from "@mui/material"

import EquipmentAttachmentsTable from "./EquipmentAttachmentsTable"
import EquipmentAttachmentsForm from "./EquipmentAttachmentsForm"

const EquipmentAttachments = ({ equipment, isLoading, isError }) => {
  return (
    <Paper elevation={1}>
      <EquipmentAttachmentsTable equipment={equipment} isLoading={isLoading} isError={isError} />
      <EquipmentAttachmentsForm equipment={equipment} isLoading={isLoading} isError={isError} />
    </Paper>
  )
}

export default EquipmentAttachments
