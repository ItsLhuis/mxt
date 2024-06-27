import React from "react"

import { useCache } from "@hooks/server/useCache"

import { LoadingButton } from "@mui/lab"
import { Paper, Box } from "@mui/material"
import { Dns } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"

const Notifications = () => {
  const { deleteCache } = useCache()
  const { mutate, isPending } = deleteCache

  const handleDeleteServerCache = () => {
    mutate()
  }

  return (
    <Paper elevation={1}>
      <HeaderSection title="Servidor" description="Definições do servidor" icon={<Dns />} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 2,
          paddingBottom: 2,
          paddingRight: 3
        }}
      >
        <HeaderSection title="Cache" description="Limpar cache do servidor" />
        <Box sx={{ paddingTop: 2 }}>
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
    </Paper>
  )
}

export default Notifications
