import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { Skeleton } from "@mui/material"

import { Loadable } from "../"

const Image = ({ src, alt, maxHeight = 40, maxWidth = 80, ...props }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const imgRef = useRef(null)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)

    const img = new window.Image()
    img.src = src

    const handleLoad = () => {
      setIsLoading(false)
      setIsError(false)
    }

    const handleError = () => {
      setIsLoading(false)
      setIsError(true)
    }

    img.onload = handleLoad
    img.onerror = handleError

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return (
    <Loadable
      isLoading={isLoading || isError}
      LoadingComponent={<Skeleton variant="rounded" height={maxHeight} width={maxWidth} />}
      LoadedComponent={
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{ maxHeight, maxWidth, width: "auto" }}
          {...props}
        />
      }
    />
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default Image
