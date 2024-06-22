import React from "react"

import notFoundEmoji from "./img/emoji.png"

import { Divider, Stack, Typography, useTheme, useMediaQuery } from "@mui/material"

import { motion } from "framer-motion"

const NotFound = ({ message }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Stack
        sx={{
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          marginTop: 6
        }}
      >
        <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h1" component="h1" sx={{ fontWeight: 800 }}>
            4
          </Typography>
          <img
            src={notFoundEmoji}
            alt="Não encontrado"
            style={{ width: "90px", height: "90px", transform: "scale(1.4)" }}
          />
          <Typography variant="h1" component="h1" sx={{ fontWeight: 800 }}>
            4
          </Typography>
        </Stack>
        <Divider
          orientation="vertical"
          flexItem={!isSmallScreen}
          variant="middle"
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1,
            width: isSmallScreen && 90
          }}
        />
        <Typography variant="h5" component="h5">
          {message}
        </Typography>
      </Stack>
    </motion.div>
  )
}

export default NotFound
