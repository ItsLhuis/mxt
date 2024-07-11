import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { useEmail } from "@hooks/server/useEmail"

import { Box, Container } from "@mui/material"
import { Send } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EmailTable } from "./components"

import { motion } from "framer-motion"

const EmailListPage = () => {
  const navigate = useNavigate()

  const { findAllEmails } = useEmail()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de E-mails"
              breadcrumbs={[{ name: "E-mail" }, { name: "Lista" }]}
              isRefetchEnable={!findAllEmails.isFetching}
              refetchFunction={() => findAllEmails.refetch()}
              isRefetching={findAllEmails.isRefetching && !findAllEmails.isRefetchError}
              button={{
                startIcon: <Send fontSize="large" />,
                title: "Enviar E-mail",
                onClick: () => navigate("/email/send")
              }}
            />
            <EmailTable />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EmailListPage
