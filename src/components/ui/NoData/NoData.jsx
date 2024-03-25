import React from "react"

import { useTheme } from "@contexts/themeContext"

import { Stack, Typography } from "@mui/material"

import Lottie from "lottie-react"
import LottieAnimationDark from "./Lottie/dark.json"
import LottieAnimationLight from "./Lottie/light.json"

const LottieAnimation = {
  dark: LottieAnimationDark,
  light: LottieAnimationLight
}

const NoData = () => {
  const { dataTheme } = useTheme()

  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--elevation-level2)",
        borderRadius: 2,
        padding: 3,
        paddingBottom: 5,
        color: "var(--outline)",
        textTransform: "uppercase"
      }}
    >
      <Lottie animationData={LottieAnimation[dataTheme]} style={{ height: 300 }} />
      <Typography variant="h6" component="h6" fontWeight={600}>
        Oops! Nenhuma informação encontrada!
      </Typography>
    </Stack>
  )
}

export default NoData
