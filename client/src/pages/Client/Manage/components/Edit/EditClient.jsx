import React, { Suspense } from "react"

import { useParams } from "react-router-dom"

import { useClient } from "@hooks/server/useClient"

import { Stack, Alert } from "@mui/material"

import { PageLoader } from "@components/ui"
import { ClientDetailsForm, ClientContact } from "./components"

import { motion } from "framer-motion"

const EditClient = () => {
  const { clientId } = useParams()

  const { findClientById } = useClient()
  const {
    data: client,
    isLoading: isClientLoading,
    isError: isClientError,
    error: clientError
  } = findClientById(clientId)

  return (
    <Suspense fallback={<PageLoader />}>
      <Stack
        sx={{
          marginTop: 3,
          paddingBottom: 3,
          gap: 3,
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 900
        }}
      >
        {isClientError && clientError.error.code === "CLI-001" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: "sticky", top: 16, zIndex: 5 }}
          >
            <Alert severity="error" elevation={1} sx={{ width: "100%" }}>
              Cliente não encontrado!
            </Alert>
          </motion.div>
        )}
        <ClientDetailsForm client={client} isLoading={isClientLoading} isError={isClientError} />
        <ClientContact client={client} isLoading={isClientLoading} isError={isClientError} />
      </Stack>
    </Suspense>
  )
}

export default EditClient
