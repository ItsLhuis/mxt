import React, { useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema } from "@schemas/user"

import { useAuth } from "@hooks/server/useAuth"

import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Box,
  ListItemText,
  Typography,
  TextField,
  FormControl,
  Link,
  Alert
} from "@mui/material"

import { motion } from "framer-motion"

const Login = () => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(authSchema)
  })

  const [loginError, setLoginError] = useState("")

  const { login } = useAuth()

  const onSubmit = async (data) => {
    await login.mutateAsync(data).catch((error) => {
      if (error.error.code === "USR-004") {
        setLoginError(
          "Esta conta foi desativada. Por favor, entre em contacto com o suporte para resolver esta questão!"
        )
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
        <ListItemText
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
        </ListItemText>
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
            <TextField
              {...register("username")}
              label="Nome de utilizador"
              error={!!errors.username}
              helperText={errors.username?.message}
              autoComplete="username"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              {...register("password")}
              type="password"
              label="Senha"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
            />
          </FormControl>
          <Link
            sx={{
              alignSelf: "flex-end",
              fontSize: "13px",
              margin: "8px 0",
              color: "inherit",
              textDecorationColor: "inherit"
            }}
          >
            Esqueceu a sua senha?
          </Link>
          <LoadingButton loading={login.isPending} type="submit" variant="contained">
            Iniciar Sessão
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  )
}

export default Login
