import PropTypes from "prop-types"

import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  Breadcrumbs,
  Button,
  Tooltip,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Home, Refresh } from "@mui/icons-material"

import { motion } from "framer-motion"

const HeaderPage = ({
  title,
  breadcrumbs,
  isRefetchEnable,
  refetchFunction,
  isRefetching,
  button
}) => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [isRefreshFinished, setIsRefreshFinished] = useState(false)

  const [lastRefreshTime, setLastRefreshTime] = useState(null)

  const handleRefetch = () => {
    if (refetchFunction && canRefetch()) {
      refetchFunction().finally(() => {
        setIsRefreshFinished(true)
        setLastRefreshTime(new Date())
      })
    }
  }

  const canRefetch = () => {
    if (!lastRefreshTime) return true

    const currentTime = new Date()
    const elapsedTime = currentTime - lastRefreshTime
    return elapsedTime >= 4000
  }

  useEffect(() => {
    if (!isRefetching) {
      const timeout = setTimeout(() => {
        setIsRefreshFinished(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [isRefetching])

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isMediumScreen ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMediumScreen ? "flex-start" : "center",
        gap: 2
      }}
    >
      <Stack sx={{ flexDirection: "row", alignItems: "flex-start", gap: 1 }}>
        <Stack sx={{ gap: 0.8 }}>
          <Stack
            sx={{
              flexDirection: refetchFunction && isMediumScreen ? "column-reverse" : "row",
              alignItems: refetchFunction && isMediumScreen ? "flex-start" : "center",
              justifyContent: "flex-start",
              gap: 1
            }}
          >
            <Typography variant="h4" component="h4">
              {title}
            </Typography>
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                height: 30
              }}
            >
              {refetchFunction && (
                <Tooltip title="Atualizar">
                  <motion.span
                    animate={{
                      rotate: isRefetching ? [0, 180, 360] : [0]
                    }}
                    transition={{
                      repeat: isRefetching ? Infinity : 0,
                      duration: 1,
                      type: "spring"
                    }}
                    style={{ marginLeft: isMediumScreen && "-8px" }}
                  >
                    <IconButton onClick={handleRefetch} disabled={isRefetching || !isRefetchEnable}>
                      <Refresh fontSize="small" />
                    </IconButton>
                  </motion.span>
                </Tooltip>
              )}
              {isRefreshFinished && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 1, 0] }}
                  transition={{
                    times: [0, 0.2, 0.8, 0.9, 1],
                    duration: 2
                  }}
                >
                  <Typography variant="p" component="p">
                    Atualizado!
                  </Typography>
                </motion.div>
              )}
            </Stack>
          </Stack>
          <Breadcrumbs
            separator={
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  backgroundColor: "var(--outline)"
                }}
              />
            }
            aria-label="breadcrumb"
            sx={{ color: "var(--onSurface)", fontSize: 13 }}
          >
            <Home fontSize="small" />
            {breadcrumbs.map((breadcrumb, index) => (
              <Box key={index}>
                {breadcrumb.link ? (
                  <Link to={breadcrumb.link} style={{ fontWeight: 600 }}>
                    {breadcrumb.name}
                  </Link>
                ) : (
                  <Typography
                    variant="p"
                    component="p"
                    sx={{ color: "var(--outline)", fontWeight: 500 }}
                  >
                    {breadcrumb.name}
                  </Typography>
                )}
              </Box>
            ))}
          </Breadcrumbs>
        </Stack>
      </Stack>
      {button && (
        <Button
          variant="contained"
          color="primary"
          startIcon={button.startIcon}
          onClick={button.onClick}
        >
          {button.title}
        </Button>
      )}
    </Stack>
  )
}

HeaderPage.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string
    })
  ).isRequired,
  isRefetchEnable: PropTypes.bool,
  refetchFunction: PropTypes.func,
  isRefetching: PropTypes.bool,
  button: PropTypes.shape({
    startIcon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })
}

export default HeaderPage
