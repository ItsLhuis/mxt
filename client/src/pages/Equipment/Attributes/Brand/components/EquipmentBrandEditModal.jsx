import React, { useEffect, useRef } from "react"

import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { brandSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Box, FormControl, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentBrandEditModal = ({ brand, open, onClose }) => {
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
    reset
  } = useForm({
    resolver: zodResolver(brandSchema)
  })

  const initialValues = {
    name: brand?.name || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (brand) {
      reset(initialValues)
    }
  }, [brand])

  const { updateEquipmentBrand } = useEquipment()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateEquipmentBrand
          .mutateAsync({ brandId: brand.id, ...data })
          .then(() => {
            onClose()
            showSuccessToast("Marca atualizada com sucesso!")
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "EQU-007") {
              setError("name", {
                brand: "manual",
                message: "Nome já existente"
              })
              reject()
              return
            }

            onClose()
            showErrorToast("Erro ao atualizar marca!")
            reject()
          })
      })
    }
  }

  return (
    <Modal
      mode="form"
      title="Editar Marca"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Marca"
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

export default EquipmentBrandEditModal
