import React, { useState } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authResetPasswordConfirm } from "@schemas/user"

import { useAuth } from "@hooks/server/useAuth"

import { Link, useNavigate, useParams } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, TextField, FormControl, Alert } from "@mui/material"

import { showSuccessToast, showErrorToast } from "@config/toast"

import { motion } from "framer-motion"

const Confirm = () => {
  const { token } = useParams()

  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(authResetPasswordConfirm),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  })

  const isFormUnchanged = () => {
    return !isDirty
  }

  const [confirmResetPasswordError, setConfirmResetPasswordError] = useState("")

  const { confirmResetPassword } = useAuth()

  const onSubmit = async (data) => {
    if (isFormUnchanged() || confirmResetPassword.isPending) return

    await confirmResetPassword
      .mutateAsync({ token, ...data })
      .then(() => {
        showSuccessToast("Senha alterada com sucesso!")
        navigate("/auth/login")
      })
      .catch((error) => {
        if (error.error.code === "USR-013" || error.error.code === "USR-014") {
          setConfirmResetPasswordError("O código foi usado ou expirado!")
          return
        }

        showErrorToast("Erro ao alterar senha!")
      })
  }

  return (
    <Box>
      <Typography
        variant="h3"
        component="h3"
        sx={{ marginBottom: 4, fontSize: "2.5rem !important" }}
      >
        Mixtech
      </Typography>
      <Stack sx={{ gap: 2, marginBottom: 4 }}>
        <Stack
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <Typography variant="h4" component="h4">
            Esqueceu a sua senha?
          </Typography>
          <Typography variant="p" component="p">
            Crie uma nova senha de sua preferência!
          </Typography>
        </Stack>
      </Stack>
      {confirmResetPasswordError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Box sx={{ marginBottom: 6 }}>
            <Alert severity="error" elevation={1}>
              {confirmResetPasswordError}
            </Alert>
          </Box>
        </motion.div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2 }}>
          <FormControl fullWidth>
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Senha"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  autoComplete="new-password"
                  disabled={confirmResetPassword.isPending}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Confirmar senha"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  autoComplete="confirm-new-password"
                  disabled={confirmResetPassword.isPending}
                />
              )}
            />
          </FormControl>
          <Link to="/auth/login" style={{ alignSelf: "flex-end", fontSize: "13px" }}>
            Iniciar sessão
          </Link>
          <LoadingButton
            loading={confirmResetPassword.isPending}
            type="submit"
            variant="contained"
            disabled={isFormUnchanged() || confirmResetPassword.isPending}
          >
            Atualizar Senha
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  )
}

export default Confirm
