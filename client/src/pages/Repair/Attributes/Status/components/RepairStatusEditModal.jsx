import React, { useEffect, useRef } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { repairStatusSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { FormControl, Stack, TextField } from "@mui/material"

import { Modal, ChipColorPicker } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const RepairStatusEditModal = ({ status, open, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm({
    resolver: zodResolver(repairStatusSchema),
    defaultValues: {
      color: "default",
      name: ""
    }
  })

  const { updateRepairStatus } = useRepair()

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

  useEffect(() => {
    if (status) {
      reset({
        color: status.color || "default",
        name: status.name || ""
      })
    }
  }, [status])

  const isFormUnchanged = () => {
    const values = watch()
    return values.color === status?.color && values.name === status?.name
  }

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
          />
        </FormControl>
      </Stack>
    </Modal>
  )
}

export default RepairStatusEditModal
