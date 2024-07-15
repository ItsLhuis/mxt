import React, { useEffect, useRef } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { optionsSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { FormControl, Box, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const RepairEntryReportedIssueAddModal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(optionsSchema)
  })

  const { createNewEntryReportedIssue } = useRepair()

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

  const onSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      createNewEntryReportedIssue
        .mutateAsync(data)
        .then(() => {
          onClose()
          showSuccessToast("Problema reportado adicionado com sucesso!")
          reset()
          resolve()
        })
        .catch((error) => {
          if (error.error.code === "REP-013") {
            setError("name", {
              type: "manual",
              message: "Nome já existente"
            })
            reject()
            return
          }

          onClose()
          showErrorToast("Erro ao adicionar problema reportado!")
          reset()
          reject()
        })
    })
  }

  return (
    <Modal
      mode="form"
      title="Adicionar Problema Reportado"
      open={open}
      onClose={onClose}
      submitButtonText="Adicionar Problema Reportado"
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

export default RepairEntryReportedIssueAddModal
