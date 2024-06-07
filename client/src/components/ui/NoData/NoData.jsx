import PropTypes from "prop-types"

import React from "react"

import { useTheme } from "@/contexts/theme"

import { Stack, Typography } from "@mui/material"

import Lottie from "lottie-react"
import LottieAnimationDark from "./Lottie/dark.json"
import LottieAnimationLight from "./Lottie/light.json"

const LottieAnimation = {
  dark: LottieAnimationDark,
  light: LottieAnimationLight
}

const NoData = ({ error, onlyLottie }) => {
  const { dataTheme } = useTheme()

  return (
    <>
      {onlyLottie ? (
        <Lottie animationData={LottieAnimation[dataTheme]} style={{ height: 150 }} />
      ) : (
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            border: 2,
            borderColor: error ? "rgb(211, 47, 47) !important" : "var(--elevation-level2)",
            backgroundColor: "var(--elevation-level2)",
            borderRadius: 2,
            padding: 3,
            paddingBottom: 5,
            color: "var(--outline)",
            textTransform: "uppercase"
          }}
        >
          <Lottie animationData={LottieAnimation[dataTheme]} style={{ height: 200 }} />
          <Typography variant="h6" component="h6" sx={{ textAlign: "center", fontWeight: 600 }}>
            Oops! Nenhuma informação encontrada!
          </Typography>
        </Stack>
      )}
    </>
  )
}

NoData.propTypes = {
  error: PropTypes.bool,
  onlyLottie: PropTypes.bool
}

export default NoData
