import PropTypes from "prop-types"

import React from "react"

import { Dialog, useTheme, useMediaQuery } from "@mui/material"

const Modal = ({ open, onClose, children }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Dialog onClose={onClose} open={open} fullScreen={fullScreen}>
      {children}
    </Dialog>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Modal
