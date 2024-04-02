import React, { useState, useEffect, useRef } from "react"

import {
  Paper,
  Box,
  ListItemText,
  Typography,
  Button,
  FormControl,
  TextField,
  Stack
} from "@mui/material"

import { Modal } from "@components/ui"

import toast from "react-hot-toast"

const Security = () => {
  const [open, setOpen] = useState(false)

  const currentPasswordRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (open && currentPasswordRef.current) {
        currentPasswordRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  return (
    <>
      <Paper elevation={1}>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h5" component="h5">
            Segurança
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 2
              }}
            >
              <ListItemText>
                <Typography variant="h6" component="h6">
                  Senha
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)" fontSize="13px">
                  Altere a sua senha
                </Typography>
              </ListItemText>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Alterar Senha
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        mode="form"
        title="Alterar Senha"
        submitButtonText="Alterar Senha"
        onSubmit={() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              toast.success("Senha alterada com sucesso!")
              resolve(true)
            }, 1000)
          })
        }}
      >
        <Stack sx={{ padding: 3, gap: 2 }}>
          <FormControl fullWidth>
            <TextField
              inputRef={currentPasswordRef}
              name="currentPassword"
              type="password"
              label="Senha atual"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField name="newPassword" type="password" label="Nova senha" />
          </FormControl>
          <FormControl fullWidth>
            <TextField name="confirmNewPassword" type="password" label="Confirmar nova senha" />
          </FormControl>
        </Stack>
      </Modal>
    </>
  )
}

export default Security
