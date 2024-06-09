import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"

import { Avatar as MuiAvatar, Skeleton } from "@mui/material"

import { Loadable } from "../"

import { getStringColor, getContrastColor } from "@utils/shared"

const Avatar = ({ alt, src, name = null, size = 40, sx }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!src) return

    setIsLoading(true)

    const img = new window.Image()
    img.src = src

    const handleLoad = () => setIsLoading(false)

    const handleError = () => setIsLoading(false)

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
          <MuiAvatar
            alt={alt}
            src={src}
            sx={{
              backgroundColor: `${backgroundColor} !important`,
              color: textColor,
              ...sx
            }}
            style={{ width: size, height: size }}
          >
            {name.charAt(0)}
          </MuiAvatar>
        }
      />
    )
  }

  return (
    <Loadable
      isLoading={isLoading}
      LoadingComponent={<Skeleton variant="circular" width={size} height={size} />}
      LoadedComponent={<MuiAvatar alt={alt} src={src} style={{ width: size, height: size }} />}
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
