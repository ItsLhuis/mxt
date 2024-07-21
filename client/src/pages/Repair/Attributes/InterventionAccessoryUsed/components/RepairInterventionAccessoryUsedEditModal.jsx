import React, { useEffect, useRef } from "react"

import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { optionsSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { FormControl, Box, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const RepairInterventionAccessoryUsedEditModal = ({ interventionAccessoryUsed, open, onClose }) => {
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
    resolver: zodResolver(optionsSchema)
  })

  const initialValues = {
    name: interventionAccessoryUsed?.name || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (interventionAccessoryUsed) {
      reset(initialValues)
    }
  }, [interventionAccessoryUsed])

  const { updateInterventionAccessoryUsed } = useRepair()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateInterventionAccessoryUsed
          .mutateAsync({ interventionAccessoryUsedId: interventionAccessoryUsed.id, ...data })
          .then(() => {
            onClose()
            showSuccessToast("Acessório da intervenção atualizado com sucesso!")
            reset()
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "REP-019") {
              setError("name", {
                type: "manual",
                message: "Nome já existente"
              })
              reject()
              return
            }

            onClose()
            showErrorToast("Erro ao atualizar acessório da intervenção!")
            reset()
            reject()
          })
      })
    }
  }

  return (
    <Modal
      mode="form"
      title="Editar Acessório da Intervenção"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Acessório da Intervenção"
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

export default RepairInterventionAccessoryUsedEditModal
