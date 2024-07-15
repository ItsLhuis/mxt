import React, { useEffect, useRef } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { typeSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, FormControl, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentTypeEditModal = ({ type, open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      name: ""
    }
  })

  const { updateEquipmentType } = useEquipment()

  const nameInputRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      if (open && nameInputRef.current) {
        nameInputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (type) {
      reset({
        name: type.name || ""
      })
    }
  }, [type])

  const isFormUnchanged = () => {
    const values = watch()
    return values.name === type?.name
  }

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateEquipmentType
          .mutateAsync({ typeId: type.id, ...data })
          .then(() => {
            onClose()
            showSuccessToast("Tipo atualizado com sucesso!")
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
            showErrorToast("Erro ao atualizar tipo!")
            reject()
          })
      })
    }
  }

  return (
    <Modal
      mode="form"
      title="Editar Tipo"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Tipo"
      onSubmit={handleSubmit(onSubmit)}
      disabled={isFormUnchanged()}
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
            InputLabelProps={{ shrink: watch("name")?.length > 0 }}
          />
        </FormControl>
      </Box>
    </Modal>
  )
}

export default EquipmentTypeEditModal
