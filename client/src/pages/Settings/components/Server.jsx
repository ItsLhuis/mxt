import React from "react"

import { useCache } from "@hooks/server/useCache"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, ListItemText, Typography } from "@mui/material"

const Notifications = () => {
  const { deleteCache } = useCache()
  const { mutate, isPending } = deleteCache

  const handleDeleteServerCache = () => {
    mutate()
  }

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" component="h5">
          Servidor
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 2
            }}
          >
            <ListItemText>
              <Typography variant="h6" component="h6">
                Cache
              </Typography>
              <Typography variant="p" component="p" color="var(--outline)" fontSize="13px">
                Limpar cache do servidor
              </Typography>
            </ListItemText>
            <LoadingButton
              loading={isPending}
              variant="contained"
              color="error"
              onClick={handleDeleteServerCache}
            >
              Limpar Cache
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default Notifications
