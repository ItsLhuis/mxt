import React, { useEffect, useRef } from "react"

import { useForm, useFormState, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { repairStatusSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { FormControl, Stack, TextField } from "@mui/material"

import { Modal, ChipColorPicker } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const RepairStatusEditModal = ({ status, open, onClose }) => {
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
    resolver: zodResolver(repairStatusSchema)
  })

  const initialValues = {
    color: status?.color || "default",
    name: status?.name || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (status) {
      reset(initialValues)
    }
  }, [status])

  const { updateRepairStatus } = useRepair()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateRepairStatus
          .mutateAsync({ statusId: status.id, ...data })
          .then(() => {
            onClose()
            showSuccessToast("Estado atualizado com sucesso!")
            reset()
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "REP-007") {
              setError("name", {
                type: "manual",
                message: "Nome já existente"
              })
              reject()
              return
            }

            onClose()
            showErrorToast("Erro ao atualizar estado!")
            reset()
            reject()
          })
      })
    }
  }

  return (
    <Modal
      mode="form"
      title="Editar Estado"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Estado"
      onSubmit={handleSubmit(onSubmit)}
      disabled={isFormUnchanged()}
    >
      <Stack sx={{ padding: 3, gap: 2 }}>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ChipColorPicker label="Cor" selected={field.value} onChange={field.onChange} />
          )}
        />
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
      </Stack>
    </Modal>
  )
}

export default RepairStatusEditModal
