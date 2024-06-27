import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"

import { Box, Avatar as MuiAvatar, Skeleton } from "@mui/material"

import { Loadable } from "../"

import { motion } from "framer-motion"

import { getStringColor, getContrastColor } from "@utils"

const Avatar = ({
  alt,
  src,
  name = null,
  size = 40,
  circular = true,
  withLoadingEffect = true,
  withBorderAnimation = false,
  loading = false,
  sx
}) => {
  const [isLoading, setIsLoading] = useState(withLoadingEffect ? loading : withLoadingEffect)
  const [isError, setIsError] = useState(true)

  useEffect(() => {
    if (!withLoadingEffect) return

    if (loading) return

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
  }, [src, loading])

  if (name) {
    const backgroundColor = getStringColor(name)
    const textColor = getContrastColor(backgroundColor)

    return (
      <Loadable
        isLoading={isLoading}
        LoadingComponent={
          <Skeleton variant={circular ? "circular" : "rounded"} width={size} height={size} />
        }
        LoadedComponent={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: size,
              height: size,
              borderRadius: circular ? "50%" : "8px"
            }}
          >
            <MuiAvatar
              alt={alt}
              src={isError ? "" : src}
              sx={{
                backgroundColor: `${backgroundColor} !important`,
                color: textColor,
                border: !withBorderAnimation && "0.1px solid var(--elevation-level6)",
                borderRadius: circular ? "50%" : "8px",
                ...sx
              }}
              style={{ width: size, height: size }}
            >
              {name.charAt(0)}
            </MuiAvatar>
            {withBorderAnimation && (
              <motion.div
                style={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  width: size + 4 * 2,
                  height: size + 4 * 2,
                  borderRadius: circular ? "50%" : "8px",
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
      LoadingComponent={
        <Skeleton variant={circular ? "circular" : "rounded"} width={size} height={size} />
      }
      LoadedComponent={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: size,
            height: size,
            borderRadius: circular ? "50%" : "8px"
          }}
        >
          <MuiAvatar
            alt={alt}
            src={src}
            sx={{ ...sx }}
            style={{ width: size, height: size, borderRadius: circular ? "50%" : "8px" }}
          />
          {withBorderAnimation && (
            <motion.div
              style={{
                position: "absolute",
                top: -4,
                left: -4,
                width: size + 4 * 2,
                height: size + 4 * 2,
                borderRadius: circular ? "50%" : "8px",
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
  alt: PropTypes.string,
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  circular: PropTypes.bool,
  withLoadingEffect: PropTypes.bool,
  withBorderAnimation: PropTypes.bool,
  loading: PropTypes.bool,
  sx: PropTypes.object
}

export default Avatar
