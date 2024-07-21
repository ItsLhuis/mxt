import React, { useEffect, useRef } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { repairStatusSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { FormControl, Stack, TextField } from "@mui/material"

import { Modal, ChipColorPicker } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const RepairStatusAddModal = ({ open, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(repairStatusSchema)
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

  const { createNewRepairStatus } = useRepair()

  const onSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      createNewRepairStatus
        .mutateAsync(data)
        .then(() => {
          onClose()
          showSuccessToast("Estado adicionado com sucesso!")
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
          showErrorToast("Erro ao adicionar estado!")
          reset()
          reject()
        })
    })
  }

  return (
    <Modal
      mode="form"
      title="Adicionar Estado"
      open={open}
      onClose={onClose}
      submitButtonText="Adicionar Estado"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack sx={{ padding: 3, gap: 2 }}>
        <Controller
          name="color"
          control={control}
          defaultValue="default"
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

export default RepairStatusAddModal
