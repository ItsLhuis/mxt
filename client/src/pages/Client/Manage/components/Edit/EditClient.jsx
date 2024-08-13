import React, { Suspense } from "react"

import { useParams } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { useClient } from "@hooks/server/useClient"

import { Stack, Alert } from "@mui/material"

import { PageLoader } from "@components/ui"
import {
  ClientDetailsForm,
  ClientContact,
  ClientAddress,
  ClientEquipmentsTable,
  ClientInteractionsHistoryTable
} from "./components"

import { motion } from "framer-motion"

const EditClient = () => {
  const { clientId } = useParams()

  const { role } = useAuth()

  const { findClientById } = useClient()
  const {
    data: client,
    isLoading: isClientLoading,
    isError: isClientError,
    error: clientError
  } = findClientById(clientId)

  return (
    <Suspense fallback={<PageLoader />}>
      <Stack sx={{ marginTop: 3, gap: 3 }}>
        {isClientError && clientError.error.code === "CLI-001" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: "sticky", top: 16, zIndex: 1 }}
          >
            <Alert severity="error" elevation={1} sx={{ width: "100%" }}>
              Cliente não encontrado!
            </Alert>
          </motion.div>
        )}
        <ClientDetailsForm client={client} isLoading={isClientLoading} isError={isClientError} />
        <ClientContact client={client} isLoading={isClientLoading} isError={isClientError} />
        <ClientAddress client={client} isLoading={isClientLoading} isError={isClientError} />
        <ClientEquipmentsTable
          client={client}
          isLoading={isClientLoading}
          isError={isClientError}
        />
        {role !== "Funcionário" && (
          <ClientInteractionsHistoryTable
            client={client}
            isLoading={isClientLoading}
            isError={isClientError}
          />
        )}
      </Stack>
    </Suspense>
  )
}

export default EditClient
