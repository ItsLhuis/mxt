import React, { forwardRef } from "react"

import { Box } from "@mui/material"

const RepairStamp = forwardRef(({ equipmentId }, ref) => {
  return (
    <Box ref={ref} sx={{ padding: 2 }}>
      <div>Olá</div>
      <div>{equipmentId}</div>
    </Box>
  )
})

export default RepairStamp
