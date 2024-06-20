import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"

import { Box, Avatar as MuiAvatar, Skeleton } from "@mui/material"

import { Loadable } from "../"

import { motion } from "framer-motion"

import { getStringColor, getContrastColor } from "@utils"

const Avatar = ({ alt, src, name = null, size = 40, withBorderAnimation = false, sx }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(true)

  useEffect(() => {
    if (!src) return

    setIsLoading(true)

    const img = new window.Image()
    img.src = src

    const handleLoad = () => {
      setIsError(false)
      setIsLoading(false)
    }

    const handleError = () => {
      setIsError(true)
      setIsLoading(false)
    }

    img.onload = handleLoad
    img.onerror = handleError

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  if (name) {
    const backgroundColor = getStringColor(name)
    const textColor = getContrastColor(backgroundColor)

    return (
      <Loadable
        isLoading={isLoading}
        LoadingComponent={<Skeleton variant="circular" width={size} height={size} />}
        LoadedComponent={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              borderRadius: "50%"
            }}
          >
            <MuiAvatar
              alt={alt}
              src={isError ? "" : src}
              sx={{
                backgroundColor: `${backgroundColor} !important`,
                color: textColor,
                ...sx
              }}
              style={{ width: size, height: size }}
            >
              {name.charAt(0)}
            </MuiAvatar>
            {!withBorderAnimation && (
              <Box
                style={{
                  position: "absolute",
                  top: -2,
                  left: -2,
                  width: size + 2 * 2,
                  height: size + 2 * 2,
                  border: `${1}px solid var(--elevation-level6)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            )}
            {withBorderAnimation && (
              <motion.div
                style={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  width: size + 4 * 2,
                  height: size + 4 * 2,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 10deg, var(--primary), var(--elevation-level6), var(--primary), var(--elevation-level6), var(--primary))",
                  mask: `radial-gradient(circle, transparent 64%, black 70%)`
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            )}
          </Box>
        }
      />
    )
  }

  return (
    <Loadable
      isLoading={isLoading}
      LoadingComponent={<Skeleton variant="circular" width={size} height={size} />}
      LoadedComponent={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            borderRadius: "50%"
          }}
        >
          <MuiAvatar alt={alt} src={src} style={{ width: size, height: size }} />
          {!withBorderAnimation && (
            <Box
              style={{
                position: "absolute",
                top: -2,
                left: -2,
                width: size + 2 * 2,
                height: size + 2 * 2,
                border: `${1}px solid var(--elevation-level6)`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            />
          )}
          {withBorderAnimation && (
            <motion.div
              style={{
                position: "absolute",
                top: -4,
                left: -4,
                width: size + 4 * 2,
                height: size + 4 * 2,
                borderRadius: "50%",
                background:
                  "conic-gradient(from 10deg, var(--primary), var(--elevation-level6), var(--primary), var(--elevation-level6), var(--primary))",
                mask: `radial-gradient(circle, transparent 64%, black 70%)`
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          )}
        </Box>
      }
    />
  )
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  sx: PropTypes.object
}

export default Avatar
