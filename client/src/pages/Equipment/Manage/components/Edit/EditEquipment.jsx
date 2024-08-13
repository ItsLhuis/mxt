import React, { Suspense } from "react"

import { useParams } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { useEquipment } from "@hooks/server/useEquipment"

import { Stack, Alert } from "@mui/material"

import { PageLoader } from "@components/ui"
import {
  EquipmentDetailsForm,
  EquipmentRepairsTable,
  EquipmentAttachments,
  EquipmentInteractionsHistoryTable,
  EquipmentTransferForm
} from "./components"

import { motion } from "framer-motion"

const EditEquipment = () => {
  const { equipmentId } = useParams()

  const { role } = useAuth()

  const { findEquipmentById } = useEquipment()
  const {
    data: equipment,
    isLoading: isEquipmentLoading,
    isError: isEquipmentError
  } = findEquipmentById(equipmentId)

  return (
    <Suspense fallback={<PageLoader />}>
      <Stack sx={{ marginTop: 3, gap: 3 }}>
        {isEquipmentError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: "sticky", top: 16, zIndex: 1 }}
          >
            <Alert severity="error" elevation={1} sx={{ width: "100%" }}>
              Equipamento não encontrado!
            </Alert>
          </motion.div>
        )}
        <EquipmentDetailsForm
          equipment={equipment}
          isLoading={isEquipmentLoading}
          isError={isEquipmentError}
        />
        <EquipmentRepairsTable
          equipment={equipment}
          isLoading={isEquipmentLoading}
          isError={isEquipmentError}
        />
        <EquipmentAttachments
          equipment={equipment}
          isLoading={isEquipmentLoading}
          isError={isEquipmentError}
        />
        {role !== "Funcionário" && (
          <EquipmentInteractionsHistoryTable
            equipment={equipment}
            isLoading={isEquipmentLoading}
            isError={isEquipmentError}
          />
        )}
        <EquipmentTransferForm
          equipment={equipment}
          isLoading={isEquipmentLoading}
          isError={isEquipmentError}
        />
      </Stack>
    </Suspense>
  )
}

export default EditEquipment
