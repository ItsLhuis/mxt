import React from "react"

import { Box } from "@mui/material"

import { PageProgress, Load } from ".."

const PageLoader = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <PageProgress />
      <Load />
    </Box>
  )
}

export default PageLoader
