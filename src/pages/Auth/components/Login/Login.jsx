import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useLoader } from "@contexts/loaderContext"

import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Box,
  ListItemText,
  Typography,
  TextField,
  FormControl,
  Link,
  useTheme,
  useMediaQuery
} from "@mui/material"

import { TypeAnimation } from "react-type-animation"

const phrases = [
  "Otimize a gestão dos seus equipamentos informáticos com a nossa plataforma",
  "Gerencie de forma eficiente e intuitiva o estado dos seus dispositivos tecnológicos",
  "Solução completa para o controlo de ativos informáticos empresariais",
  "Aumente a produtividade da sua equipa de TI com a nossa ferramenta especializada",
  "Tenha o controlo total sobre os seus equipamentos informáticos e as suas operações",
  "Maximize a eficiência dos seus processos de manutenção de sistemas informáticos",
  "Gerencie o seu inventário de hardware e software de forma inteligente e simplificada",
  "Facilite a localização e monitorização dos seus ativos tecnológicos",
  "Impulsione o crescimento do seu negócio com a nossa plataforma de gestão de TI",
  "Garanta o sucesso da sua empresa com uma gestão de ativos informáticos eficaz"
]

const Login = () => {
  const navigate = useNavigate()

  const { showLoader } = useLoader()

  const isLargeScreen = useMediaQuery(useTheme().breakpoints.down("lg"))

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
        <Box sx={{ padding: 10, margin: "auto", marginLeft: 0 }}>
          <TypeAnimation
            sequence={phrases.flatMap((phrase, index) => [
              phrase,
              index < phrases.length - 1 ? 1000 : null
            ])}
            speed={1}
            style={{ fontSize: "3rem", fontWeight: 600, display: "inline-block" }}
            repeat={Infinity}
          />
        </Box>
      )}
      <Stack sx={{ background: "var(--background)" }}>
        <Stack
          sx={{
            width: "100%",
            maxWidth: "530px",
            margin: "auto",
            padding: isLargeScreen ? 3 : 8
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            sx={{ marginBottom: 4, fontSize: "2.5rem !important" }}
          >
            MixTech
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
          <form onSubmit={handleSubmit}>
            <Stack sx={{ gap: 2 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  name="username"
                  type="text"
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
                  type="password"
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
              <LoadingButton loading={load} type="submit" variant="contained">
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
