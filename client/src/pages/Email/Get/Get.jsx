import React, { Suspense } from "react"

import { Box, Container } from "@mui/material"

import { PageLoader, HeaderPage } from "@components/ui"
import { GetEmail } from "./components"

import { motion } from "framer-motion"

const GetEmailPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Ver E-mail"
              breadcrumbs={[{ name: "E-mail", link: "/email/list" }, { name: "Ver" }]}
            />
            <GetEmail />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default GetEmailPage
