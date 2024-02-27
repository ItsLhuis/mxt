import React from "react"

import { Box, Avatar, Typography, IconButton } from "@mui/material"
import { PhotoCamera } from "@mui/icons-material"

const ImagePicker = ({ image, setImage, alt, sx }) => {
  const handleChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleClick = () => {
    document.getElementById("image-input").click()
  }

  return (
    <div style={{ height: 120, width: 120 }}>
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
          "&:hover > .hover-upload-image": { opacity: 1 }
        }}
      >
        <Avatar
          alt={alt}
          src={image ? URL.createObjectURL(image) : null}
          sx={{
            height: 120,
            width: 120,
            cursor: "pointer",
            ...sx
          }}
        />
        <Box
          className="hover-upload-image"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "opacity 0.3s ease"
          }}
        >
          <PhotoCamera fontSize="large" />
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
            right: "0px",
            bottom: "0px"
          }}
          onClick={handleClick}
        >
          <PhotoCamera fontSize="small" />
        </IconButton>
      </Box>
    </div>
  )
}

export default ImagePicker
