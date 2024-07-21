import React, { useEffect, useRef } from "react"

import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { typeSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, FormControl, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentTypeEditModal = ({ type, open, onClose }) => {
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

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(typeSchema)
  })

  const initialValues = {
    name: type?.name || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (type) {
      reset(initialValues)
    }
  }, [type])

  const { updateEquipmentType } = useEquipment()

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
            InputLabelProps={{ shrink: getValues("name")?.length > 0 }}
          />
        </FormControl>
      </Box>
    </Modal>
  )
}

export default EquipmentTypeEditModal
