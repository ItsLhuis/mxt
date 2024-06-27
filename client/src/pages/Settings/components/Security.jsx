import React, { useState, useEffect, useRef } from "react"

import {
  Paper,
  Box,
  Button,
  FormControl,
  TextField,
  Stack
} from "@mui/material"
import SecurityIcon from "@mui/icons-material/Security"

import { HeaderSection, Modal } from "@components/ui"

import { showSuccessToast } from "@config/toast"

const Security = () => {
  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const currentPasswordRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (changePasswordModal && currentPasswordRef.current) {
        currentPasswordRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [changePasswordModal])

  return (
    <>
      <Paper elevation={1}>
        <HeaderSection
          title="Segurança"
          description="Definições de Segurança"
          icon={<SecurityIcon />}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 2,
            paddingBottom: 2,
            paddingRight: 3
          }}
        >
          <HeaderSection title="Senha" description="Altere a sua senha" />
          <Box sx={{paddingTop: 2}}>
          <Button variant="contained" color="error" onClick={() => setChangePasswordModal(true)}>
            Alterar Senha
          </Button>
          </Box>
        </Box>
      </Paper>
      <Modal
        open={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        mode="form"
        title="Alterar Senha"
        submitButtonText="Alterar Senha"
        onSubmit={() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              showSuccessToast("Senha alterada com sucesso!")
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
