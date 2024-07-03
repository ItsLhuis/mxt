import React from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authResetPasswordVerify } from "@schemas/user"

import { useAuth } from "@hooks/server/useAuth"

import { Link, useNavigate, useParams } from "react-router-dom"
import { MuiOtpInput } from "mui-one-time-password-input"
import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, FormHelperText } from "@mui/material"

import { showErrorToast } from "@config/toast"

const Verify = () => {
  const { token } = useParams()

  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(authResetPasswordVerify)
  })

  const { verifyResetPassword } = useAuth()

  const onSubmit = async (data) => {
    await verifyResetPassword
      .mutateAsync({ token, ...data })
      .then((data) => navigate(`/auth/resetPassword/confirm/${data.token}`))
      .catch((error) => {
        if (error.error.code === "USR-013" || error.error.code === "USR-014") {
          setError("otp", {
            type: "manual",
            message: "Código inválido ou expirado"
          })
          return
        }

        showErrorToast("Erro ao verificar código!")
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
            Digite o código que lhe foi enviado para o e-mail!
          </Typography>
        </Stack>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2 }}>
          <Stack>
            <Typography variant="p" component="p" sx={{ marginBottom: 1 }}>
              Código
            </Typography>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <Box>
                  <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} />
                  {!!errors.otp && <FormHelperText error>{errors.otp.message}</FormHelperText>}
                </Box>
              )}
            />
          </Stack>
          <Link to="/auth/login" style={{ alignSelf: "flex-end", fontSize: "13px" }}>
            Iniciar sessão
          </Link>
          <LoadingButton loading={verifyResetPassword.isPending} type="submit" variant="contained">
            Enviar Código
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  )
}

export default Verify
