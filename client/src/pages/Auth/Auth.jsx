import React, { Suspense } from "react"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { Stack, Box, useTheme, useMediaQuery } from "@mui/material"

import { PageProgress } from "@components/ui"

import { Login } from "./components"

import { TypeAnimation } from "react-type-animation"

const phrases = [
  "Otimize a gestão dos seus equipamentos informáticos",
  "Gerencie de forma eficiente e intuitiva o estado dos seus dispositivos tecnológicos",
  "Solução completa para o controlo de ativos informáticos empresariais",
  "Aumente a produtividade da sua equipa de TI com a nossa ferramenta especializada",
  "Tenha o controlo total sobre os seus equipamentos informáticos e as suas operações",
  "Maximize a eficiência dos seus processos de manutenção de sistemas informáticos",
  "Gerencie o seu inventário de hardware e software de forma inteligente e simplificada",
  "Facilite a localização e monitorização dos seus ativos tecnológicos",
  "Impulsione o crescimento do seu negócio de gestão de TI",
  "Garanta o sucesso da sua empresa com uma gestão de ativos informáticos eficaz"
]

const Auth = () => {
  const location = useLocation()

  const isLargeScreen = useMediaQuery(useTheme().breakpoints.down("lg"))

  return (
    <Suspense fallback={<PageProgress />}>
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
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate replace to="/auth/login" />} />
              <Route path="/auth" element={<Navigate replace to="/auth/login" />} />

              <Route path="/auth/login" element={<Login />} />

              <Route path="*" element={<Navigate replace to="/auth/login" />} />
            </Routes>
          </Stack>
        </Stack>
      </Stack>
    </Suspense>
  )
}

export default Auth
