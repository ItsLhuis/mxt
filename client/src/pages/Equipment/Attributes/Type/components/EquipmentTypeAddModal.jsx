import React, { useEffect, useRef } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { typeSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, FormControl, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentTypeAddModal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(typeSchema)
  })

  const nameInputRef = useRef(null)

  useEffect(() => {
    if (!open) {
      reset()
      return
    }

    const timer = setTimeout(() => {
      if (open && nameInputRef.current) {
        nameInputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  const { createNewEquipmentType } = useEquipment()

  const onSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      createNewEquipmentType
        .mutateAsync(data)
        .then(() => {
          onClose()
          showSuccessToast("Tipo adicionado com sucesso!")
          reset()
          resolve()
        })
        .catch((error) => {
          if (error.error.code === "EQU-007") {
            setError("name", {
              type: "manual",
              message: "Nome já existente"
            })
            reject()
            return
          }

          onClose()
          showErrorToast("Erro ao adicionar tipo!")
          reset()
          reject()
        })
    })
  }

  return (
    <Modal
      mode="form"
      title="Adicionar Tipo"
      open={open}
      onClose={onClose}
      submitButtonText="Adicionar Tipo"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ padding: 3 }}>
        <FormControl fullWidth>
          <TextField
            {...register("name")}
            label="Nome"
            error={!!errors.name}
            helperText={errors.name?.message}
            autoComplete="off"
            inputRef={nameInputRef}
          />
        </FormControl>
      </Box>
    </Modal>
  )
}

export default EquipmentTypeAddModal
