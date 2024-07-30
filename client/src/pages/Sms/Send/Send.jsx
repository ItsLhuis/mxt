import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { SendSmsForm } from "./components"

import { motion } from "framer-motion"

const SendSmsPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Enviar SMS"
              breadcrumbs={[{ name: "SMS", link: "/sms/list" }, { name: "Enviar" }]}
            />
            <SendSmsForm />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default SendSmsPage
