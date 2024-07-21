import PropTypes from "prop-types"

import React, { useEffect, useState, useRef } from "react"

import { Box, Typography, Skeleton, Stack, ButtonBase } from "@mui/material"
import { PhotoCamera } from "@mui/icons-material"

import { Loadable, Avatar } from ".."

const ImagePicker = ({
  image,
  onChange,
  error,
  helperText,
  withLoadingEffect = true,
  alt,
  name,
  size = 120,
  circular = true,
  loading = false,
  sx
}) => {
  const inputRef = useRef(null)

  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(error)
  }, [error])

  const handleChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (
        selectedFile.type.startsWith("image/") &&
        ["image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type)
      ) {
        if (selectedFile.size <= 5 * 1024 * 1024) {
          onChange(selectedFile)
          setImageError(false)
        } else {
          setImageError(true)
        }
      } else {
        setImageError(true)
      }
    }
  }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const isURL = (image) => {
    return typeof image === "string" && (image.startsWith("http") || image.startsWith("blob"))
  }

  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <input
        ref={inputRef}
        type="file"
        id="image-input"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <ButtonBase
        onClick={handleClick}
        sx={{
          position: "relative",
          display: "inline-block",
          borderRadius: circular ? "50%" : "8px",
          "&:hover > .hover-upload-image": { opacity: 1 }
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: circular ? "50%" : "8px",
            border: imageError ? "2px dashed rgb(211, 47, 47)" : "2px dashed var(--outline)",
            padding: 1
          }}
        >
          <Loadable
            isLoading={false}
            LoadingComponent={<Skeleton variant="circular" height={size} width={size} />}
            LoadedComponent={
              <Avatar
                circular={circular}
                withLoadingEffect={withLoadingEffect}
                alt={alt}
                src={
                  isURL(image)
                    ? image
                    : typeof image === "string"
                    ? ""
                    : image instanceof Blob || image instanceof File
                    ? URL.createObjectURL(image)
                    : ""
                }
                name={name ? name : ""}
                size={size}
                loading={loading}
                sx={{
                  cursor: "pointer",
                  ...sx
                }}
              />
            }
          />
        </Stack>
        <Box
          className="hover-upload-image"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(20, 20, 20, 0.5)",
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "rgb(228, 225, 230)",
            borderRadius: circular ? "50%" : "8px",
            cursor: "pointer",
            margin: 1,
            transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
          }}
        >
          <PhotoCamera fontSize="large" sx={{ color: "rgb(228, 225, 230)" }} />
          <Typography
            variant="p"
            component="p"
            sx={{ paddingLeft: 1.5, paddingRight: 1.5, fontSize: 11, fontWeight: 600 }}
          >
            Selecionar Imagem
          </Typography>
        </Box>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            right: circular ? 0 : -8,
            bottom: circular ? 0 : -8,
            background: "var(--primary)",
            borderRadius: "50%",
            padding: "8px",
            userSelect: "none",
            cursor: "pointer"
          }}
        >
          <PhotoCamera fontSize="small" sx={{ color: "rgb(228, 225, 230)" }} />
        </span>
      </ButtonBase>
      <Typography
        variant="p"
        component="p"
        sx={{
          marginLeft: 3,
          marginRight: 3,
          marginTop: 2,
          color: imageError ? "rgb(211, 47, 47)" : "var(--outline)",
          fontSize: "0.70rem"
        }}
      >
        {error && (
          <>
            {helperText} <br></br>
          </>
        )}
        Permitido *.jpeg, *.jpg e *.png <br></br> Tamanho máximo de 5 Mb
      </Typography>
    </Stack>
  )
}

ImagePicker.propTypes = {
  image: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  alt: PropTypes.string,
  size: PropTypes.number,
  circular: PropTypes.bool,
  loading: PropTypes.bool,
  sx: PropTypes.object
}

export default ImagePicker
