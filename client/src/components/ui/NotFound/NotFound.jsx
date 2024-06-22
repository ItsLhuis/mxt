import React from "react"

import { useNavigate } from "react-router-dom"

import { useLoader } from "@contexts/loader"

import notFoundEmoji from "./img/emoji.png"

import { Box, Button, Stack, Typography } from "@mui/material"

import { Navbar } from "@components"
import { Image } from ".."
import Rings from "./Rings/Rings"

import { motion } from "framer-motion"

const NotFound = () => {
  const navigate = useNavigate()

  const { showLoader, hideLoader } = useLoader()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Rings />
      <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", overflowY: "auto" }}>
        <Stack sx={{ height: "100%", width: "100%", zIndex: 10 }}>
          <Navbar isNotFound />
          <Box sx={{ margin: "auto", maxWidth: "520px", padding: 3 }}>
            <Stack
              sx={{
                flexDirection: "collumn",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 4
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontSize: 146, fontWeight: 800, zIndex: 10 }}
                >
                  4
                </Typography>
                <Image
                  src={notFoundEmoji}
                  alt="Não encontrado"
                  maxWidth={120}
                  maxHeight={120}
                  style={{
                    width: "120px",
                    height: "120px",
                    transform: "scale(1.4)",
                    zIndex: 1,
                    userSelect: "none"
                  }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontSize: 146, fontWeight: 800, zIndex: 10 }}
                >
                  4
                </Typography>
              </Stack>
              <Stack sx={{ gap: 1.5 }}>
                <Typography variant="h3" component="h3" sx={{ fontWeight: 800 }}>
                  Página não encontrada!
                </Typography>
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "var(--outline)", fontSize: 14 }}
                >
                  Desculpe, mas a página que você procura não existe, foi removida, o nome foi
                  alterado ou está temporariamente indisponível
                </Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={() => {
                  showLoader()
                  setTimeout(() => {
                    navigate("/dashboard")
                    hideLoader()
                  }, 200)
                }}
              >
                Voltar ao Painel de Controlo
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  )
}

export default NotFound
