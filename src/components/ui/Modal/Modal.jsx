import PropTypes from "prop-types"

import React, { useState } from "react"

import { LoadingButton } from "@mui/lab"
import {
  Dialog,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Close } from "@mui/icons-material"

const Modal = ({
  open,
  onClose,
  title,
  mode = "normal",
  cancelButtonText = "Cancelar",
  submitButtonText = "Ok",
  onSubmit,
  children
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  if (mode === "normal") {
    return (
      <Dialog
        onClose={onClose}
        open={open}
        fullScreen={fullScreen}
        sx={{ "& .MuiPaper-root": { borderRadius: fullScreen && "0 !important" } }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            paddingLeft: 3
          }}
        >
          <Typography variant="h4" component="h4">
            {title}
          </Typography>
          <Tooltip title="Fechar" placement="bottom">
            <IconButton aria-label="close" onClick={onClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        {children}
      </Dialog>
    )
  }

  if (mode === "form") {
    const [load, setLoad] = useState(false)

    const handleClose = () => {
      if (!load) {
        onClose()
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault()

      setLoad(true)

      try {
        const result = await onSubmit()

        setLoad(false)

        if (result) {
          onClose()
        } else {
          setLoad(false)
        }
      } catch (error) {
        setLoad(false)
      }
    }

    return (
      <Dialog
        onClose={handleClose}
        open={open}
        fullScreen={fullScreen}
        disableEscapeKeyDown={load}
        sx={{ "& .MuiPaper-root": { borderRadius: fullScreen && "0 !important" } }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            paddingLeft: 3
          }}
        >
          <Typography variant="h4" component="h4">
            {title}
          </Typography>
          <Tooltip title="Fechar" placement="bottom">
            <IconButton aria-label="close" onClick={handleClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Box sx={{ overflow: "auto", height: fullScreen ? "100%" : "auto", minHeight: 64 }}>
          <form onSubmit={handleSubmit}>{children}</form>
        </Box>
        <Divider
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: 3,
            gap: 1
          }}
        >
          <Button variant="contained secundary" onClick={handleClose}>
            {cancelButtonText}
          </Button>
          <LoadingButton loading={load} type="submit" onClick={handleSubmit} variant="contained">
            {submitButtonText}
          </LoadingButton>
        </Box>
      </Dialog>
    )
  }
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["normal", "form"]),
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onSubmit: function (props, propName, componentName) {
    if (
      props.mode === "form" &&
      (props[propName] === undefined || typeof props[propName] !== "function")
    ) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. onSubmit can only be provided when mode is 'form'.`
      )
    }
  },
  children: PropTypes.node.isRequired
}

export default Modal
