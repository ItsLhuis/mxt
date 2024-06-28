import React from "react"

import { useAuth } from "@hooks/server/useAuth"

import { LoadingButton } from "@mui/lab"
import { Box } from "@mui/material"

import { HeaderSection } from "@components/ui"

const UserLogout = ({ isLoading, isError }) => {
  const isUserFinished = !isLoading && !isError

  const { logout } = useAuth()
  const { mutate, isPending } = logout

  const handleLogout = () => {
    mutate()
  }

  return (
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
      <HeaderSection title="Terminar Sessão" description="Terminar sessão" />
      <Box sx={{ paddingTop: 2 }}>
        <LoadingButton
          loading={isPending}
          type="submit"
          variant="contained"
          color="error"
          onClick={handleLogout}
          disabled={!isUserFinished}
        >
          Terminar Sessão
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default UserLogout
