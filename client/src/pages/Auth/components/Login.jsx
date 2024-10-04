import React, { useState } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema } from "@schemas/user"

import { useAuth } from "@hooks/server/useAuth"

import { Link } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, TextField, FormControl, Alert } from "@mui/material"

import { motion } from "framer-motion"

const Login = () => {
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const isFormUnchanged = () => {
    return !isDirty
  }

  const [loginError, setLoginError] = useState("")

  const { login } = useAuth()

  const onSubmit = async (data) => {
    if (isFormUnchanged() || login.isPending) return

    await login.mutateAsync(data).catch((error) => {
      if (error.error.code === "USR-004") {
        setLoginError("Esta conta foi desativada. Por favor, entre em contacto com o suporte!")
        return
      }

      setFocus("username")
      setLoginError("Nome de utilizador ou senha inválidos!")
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
            Iniciar Sessão
          </Typography>
          <Typography variant="p" component="p">
            Bem vindo de volta!
          </Typography>
        </Stack>
      </Stack>
      {loginError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Box sx={{ marginBottom: 6 }}>
            <Alert severity="error" elevation={1}>
              {loginError}
            </Alert>
          </Box>
        </motion.div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2 }}>
          <FormControl fullWidth>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome de utilizador"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  autoComplete="username"
                  disabled={login.isPending}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Senha"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  autoComplete="current-password"
                  disabled={login.isPending}
                />
              )}
            />
          </FormControl>
          <Link
            to="/auth/reset-password/request"
            style={{ alignSelf: "flex-end", fontSize: "13px" }}
          >
            Esqueceu a sua senha?
          </Link>
          <LoadingButton
            loading={login.isPending}
            type="submit"
            variant="contained"
            disabled={isFormUnchanged() || login.isPending}
          >
            Iniciar Sessão
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  )
}

export default Login
