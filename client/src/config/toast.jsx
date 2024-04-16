import React from "react"

import { Stack, Typography, Tooltip, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"

import { toast } from "react-hot-toast"

const CustomToast = ({ message, onClose }) => {
  return (
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        marginLeft: 1
      }}
    >
      <Typography
        variant="p"
        component="p"
        sx={{ wordWrap: "break-word", overflowWrap: "anywhere" }}
      >
        {message}
      </Typography>
      <Tooltip title="Fechar">
        <IconButton onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

export const showSuccessToast = (message) => {
  toast.success((t) => <CustomToast message={message} onClose={() => toast.dismiss(t.id)} />)
}

export const showErrorToast = (message) => {
  toast.error((t) => <CustomToast message={message} onClose={() => toast.dismiss(t.id)} />)
}
