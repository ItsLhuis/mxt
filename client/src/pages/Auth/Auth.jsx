import React, { Suspense } from "react"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { Stack, Box, useTheme, useMediaQuery } from "@mui/material"

import { PageProgress } from "@components/ui"

import {
  Login,
  ResetPasswordRequest,
  ResetPasswordVerify,
  ResetPasswordConfirm
} from "./components"

import { TypeAnimation } from "react-type-animation"

import { motion, AnimatePresence } from "framer-motion"

const phrases = [
  "Registe novos colaboradores para uma gestão eficiente da equipa",
  "Adicione clientes para registar as suas interações e histórico de equipamentos",
  "Controle tipos, marcas e modelos de equipamentos para melhor organização",
  "Registe reparações detalhadas, desde o relato inicial até à entrega",
  "Mantenha registos de interações com clientes para comunicação clara",
  "Carregue anexos, como imagens ou documentos, para cada equipamento ou reparação",
  "Utilize opções predefinidas para relatar problemas e trabalhos realizados",
  "Acompanhe o estado de cada reparação para cumprir prazos estabelecidos",
  "Notifique os clientes sobre o progresso das reparações",
  "Analise relatórios para obter informações abrangentes sobre a plataforma"
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
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Navigate replace to="/auth/login" />} />
                  <Route path="/auth" element={<Navigate replace to="/auth/login" />} />

                  <Route path="/auth/login" element={<Login />} />

                  <Route path="/auth/resetPassword/request" element={<ResetPasswordRequest />} />
                  <Route
                    path="/auth/resetPassword/verify/:token"
                    element={<ResetPasswordVerify />}
                  />
                  <Route
                    path="/auth/resetPassword/confirm/:token"
                    element={<ResetPasswordConfirm />}
                  />

                  <Route path="*" element={<Navigate replace to="/auth/login" />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Stack>
        </Stack>
      </Stack>
    </Suspense>
  )
}

export default Auth
