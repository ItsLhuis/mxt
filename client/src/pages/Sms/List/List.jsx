import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { useSms } from "@hooks/server/useSms"

import { Box, Container } from "@mui/material"
import { Send } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { SmsTable } from "./components"

import { motion } from "framer-motion"

const SmsListPage = () => {
  const navigate = useNavigate()

  const { findAllSmses } = useSms()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de SMS"
              breadcrumbs={[{ name: "SMS" }, { name: "Lista" }]}
              isRefetchEnable={!findAllSmses.isFetching}
              refetchFunction={() => findAllSmses.refetch()}
              isRefetching={findAllSmses.isRefetching && !findAllSmses.isRefetchError}
              button={{
                startIcon: <Send fontSize="large" />,
                title: "Enviar SMS",
                onClick: () => navigate("/sms/send")
              }}
            />
            <SmsTable />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default SmsListPage
