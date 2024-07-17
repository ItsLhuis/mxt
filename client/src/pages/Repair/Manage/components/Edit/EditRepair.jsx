import React, { Suspense } from "react"

import { useParams } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { useRepair } from "@hooks/server/useRepair"

import { Stack, Alert } from "@mui/material"

import { PageLoader } from "@components/ui"
import { RepairDetailsForm, RepairAttachments, RepairInteractionsHistoryTable } from "./components"

import { motion } from "framer-motion"

const EditRepair = () => {
  const { repairId } = useParams()

  const { role } = useAuth()

  const { findRepairById } = useRepair()
  const {
    data: repair,
    isLoading: isRepairLoading,
    isError: isRepairError
  } = findRepairById(repairId)

  return (
    <Suspense fallback={<PageLoader />}>
      <Stack
        sx={{
          marginTop: 3,
          paddingBottom: 3,
          gap: 3
        }}
      >
        {isRepairError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: "sticky", top: 16, zIndex: 1 }}
          >
            <Alert severity="error" elevation={1} sx={{ width: "100%" }}>
              Reparação não encontrada!
            </Alert>
          </motion.div>
        )}
        <RepairDetailsForm repair={repair} isLoading={isRepairLoading} isError={isRepairError} />
        {role !== "Funcionário" && (
          <RepairInteractionsHistoryTable
            repair={repair}
            isLoading={isRepairLoading}
            isError={isRepairError}
          />
        )}
      </Stack>
    </Suspense>
  )
}

export default EditRepair
