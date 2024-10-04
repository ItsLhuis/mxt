import React from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authResetPasswordRequest } from "@schemas/user"

import { useAuth } from "@hooks/server/useAuth"

import { Link, useNavigate } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, TextField, FormControl } from "@mui/material"

import { showErrorToast } from "@config/toast"

const Login = () => {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setError
  } = useForm({
    resolver: zodResolver(authResetPasswordRequest),
    defaultValues: {
      email: ""
    }
  })

  const isFormUnchanged = () => {
    return !isDirty
  }

  const { requestResetPassword } = useAuth()

  const onSubmit = async (data) => {
    if (isFormUnchanged() || requestResetPassword.isPending) return

    await requestResetPassword
      .mutateAsync(data)
      .then((data) => navigate(`/auth/reset-password/verify/${data.token}`))
      .catch((error) => {
        if (error.error.code === "USR-003") {
          setError("email", {
            type: "manual",
            message: "Não existe nenhuma conta associada a este e-mail"
          })
          return
        }

        showErrorToast("Erro ao enviar código!")
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
            Digite o e-mail associado à sua conta!
          </Typography>
        </Stack>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2 }}>
          <FormControl fullWidth>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="E-mail"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  autoComplete="off"
                  disabled={requestResetPassword.isPending}
                />
              )}
            />
          </FormControl>
          <Link to="/auth/login" style={{ alignSelf: "flex-end", fontSize: "13px" }}>
            Iniciar sessão
          </Link>
          <LoadingButton
            loading={requestResetPassword.isPending}
            type="submit"
            variant="contained"
            disabled={isFormUnchanged() || requestResetPassword.isPending}
          >
            Enviar Código
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  )
}

export default Login
