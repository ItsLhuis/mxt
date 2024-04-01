import PropTypes from "prop-types"

import React, { useState } from "react"

import { Box, Avatar, Typography, IconButton } from "@mui/material"
import { PhotoCamera } from "@mui/icons-material"

const ImagePicker = ({ image, setImage, alt, size = [120, 120], sx }) => {
  const [avatarWidth, avatarHeight] = size

  const [error, setError] = useState(false)

  const handleChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        if (selectedFile.size <= 3 * 1024 * 1024) {
          setImage(selectedFile)
          setError(false)
        } else {
          setError(true)
        }
      } else {
        setError(true)
      }
    }
  }

  const handleClick = () => {
    document.getElementById("image-input").click()
  }

  const isURL = (image) => {
    return typeof image === "string" && image.startsWith("http")
  }

  return (
    <Box>
      <input
        type="file"
        id="image-input"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <Box
        component="label"
        htmlFor="image-input"
        sx={{
          position: "relative",
          display: "inline-block",
          borderRadius: "50%",
          "&:hover > .hover-upload-image": { opacity: 1 },
          cursor: "pointer"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            border: error ? "2px dashed rgb(211, 47, 47)" : "2px dashed var(--outline)",
            padding: 1
          }}
        >
          <Avatar
            alt={alt}
            src={isURL(image) ? image : image ? URL.createObjectURL(image) : null}
            sx={{
              width: avatarWidth,
              height: avatarHeight,
              cursor: "pointer",
              ...sx
            }}
          />
        </Box>
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
            color: "white",
            borderRadius: "50%",
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
            Mudar Imagem
          </Typography>
        </Box>
        <IconButton
          className="primary"
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0
          }}
          onClick={handleClick}
        >
          <PhotoCamera fontSize="small" sx={{ color: "rgb(228, 225, 230)" }} />
        </IconButton>
      </Box>
      <Typography
        variant="p"
        component="p"
        sx={{
          marginLeft: 3,
          marginRight: 3,
          marginTop: 2,
          color: error ? "rgb(211, 47, 47)" : "var(--outline)",
          fontSize: "0.70rem"
        }}
      >
        Permitido *.jpeg, *.jpg, *.png e *.ico <br></br> Tamanho máximo de 3 Mb
      </Typography>
    </Box>
  )
}

ImagePicker.propTypes = {
  image: PropTypes.any,
  setImage: PropTypes.func.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object
}

export default ImagePicker
