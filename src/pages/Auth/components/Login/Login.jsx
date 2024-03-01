import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useLoader } from "@contexts/loaderContext"

import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Typography,
  TextField,
  FormControl,
  Link,
  useTheme,
  useMediaQuery
} from "@mui/material"

const Login = () => {
  const navigate = useNavigate()

  const { showLoader } = useLoader()

  const isLargeScreen = useMediaQuery(useTheme().breakpoints.down("lg"))
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"))

  const [load, setLoad] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoad(true)

    setTimeout(() => {
      const newErrors = {}
      if (!formData.username) {
        newErrors.username = "O nome de utilizador é obrigatório"
      }
      if (!formData.password) {
        newErrors.password = "A senha é obrigatória"
      }
      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        showLoader()

        setTimeout(() => {
          navigate("/")
        }, 300)
      }

      setLoad(false)
    }, 1000)
  }

  return (
    <Stack
      component="main"
      flexDirection="row"
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: !isLargeScreen ? "65% 35%" : "100%",
        overflow: "hidden",
        overflowY: "auto",
        backgroundColor: "var(--elevation-level1)",
        "&::-webkit-scrollbar": {
          backgroundColor: "var(--background)"
        }
      }}
    >
      {!isLargeScreen && (
        <Stack
          sx={{
            margin: "auto",
            alignItems: "center",
            gap: 5
          }}
        ></Stack>
      )}
      <Stack sx={{ background: "var(--background)" }}>
        <Stack
          sx={{
            width: "100%",
            maxWidth: "530px",
            margin: "auto",
            padding: isLargeScreen ? 3 : 7
          }}
        >
          <Stack sx={{ gap: 2, marginBottom: 4 }}>
            <Typography variant="h3" component="h3">
              Iniciar Sessão
            </Typography>
            <Stack
              sx={{
                flexDirection: isSmallScreen ? "column" : "row",
                alignItems: isSmallScreen ? "flex-start " : "center"
              }}
            >
              <Typography variant="p" component="p">
                Ainda não tem conta?&nbsp;
              </Typography>
              <Link
                sx={{
                  fontSize: "13px",
                  textDecorationColor: "inherit"
                }}
              >
                Crie agora!
              </Link>
            </Stack>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Stack sx={{ gap: 2 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  name="username"
                  type={"text"}
                  value={formData.username}
                  onChange={handleChange}
                  label="Nome de utilizador"
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </FormControl>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  name="password"
                  type={"password"}
                  value={formData.password}
                  onChange={handleChange}
                  label="Senha"
                  error={!!errors.password}
                  helperText={errors.password}
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
              <LoadingButton
                loading={load}
                type="submit"
                variant="contained"
              >
                Iniciar Sessão
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Login
