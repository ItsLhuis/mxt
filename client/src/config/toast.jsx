import React from "react"

import { Stack, Box, Typography, Tooltip, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"

import { toast } from "react-hot-toast"

import { formatHTML } from "@utils/format/formatHTML"

const CustomToast = ({ message, onClose }) => {
  return (
    <>
      <Typography
        variant="p"
        component="p"
        sx={{
          wordWrap: "break-word",
          overflowWrap: "anywhere",
          marginLeft: 1,
          marginRight: 5.5,
          marginBlock: -0.2
        }}
        dangerouslySetInnerHTML={formatHTML(message)}
      />
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <Tooltip title="Fechar">
          <IconButton onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export const showSuccessToast = (message, { duration = 4000 } = {}) => {
  toast.success((t) => <CustomToast message={message} onClose={() => toast.dismiss(t.id)} />, {
    duration
  })
}

export const showErrorToast = (message, { duration = 4000 } = {}) => {
  toast.error((t) => <CustomToast message={message} onClose={() => toast.dismiss(t.id)} />, {
    duration
  })
}
