import React from "react"

import { Paper, Box, Typography } from "@mui/material"

const Notifications = () => {
  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" component="h4">
          Notificações
        </Typography>
      </Box>
    </Paper>
  )
}

export default Notifications
