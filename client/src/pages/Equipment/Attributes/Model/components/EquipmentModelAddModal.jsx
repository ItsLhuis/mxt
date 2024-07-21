import React, { useEffect, useRef } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modelSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Stack, FormControl, TextField, Skeleton } from "@mui/material"

import { Modal, Loadable, Select } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentModelAddModal = ({ open, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(modelSchema)
  })

  const brandInputRef = useRef(null)

  useEffect(() => {
    if (!open) {
      reset()
      return
    }

    const timer = setTimeout(() => {
      if (open && brandInputRef.current) {
        brandInputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  const { findAllEquipmentBrands, createNewEquipmentModel } = useEquipment()

  const onSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      createNewEquipmentModel
        .mutateAsync(data)
        .then(() => {
          onClose()
          showSuccessToast("Modelo adicionado com sucesso!")
          reset()
          resolve()
        })
        .catch((error) => {
          if (error.error.code === "EQU-005") {
            setError("name", {
              type: "manual",
              message: "Nome já existente"
            })
            reject()
            return
          }

          onClose()
          showErrorToast("Erro ao adicionar modelo!")
          reset()
          reject()
        })
    })
  }

  return (
    <Modal
      mode="form"
      title="Adicionar Modelo"
      open={open}
      onClose={onClose}
      submitButtonText="Adicionar Modelo"
      onSubmit={handleSubmit(onSubmit)}
      disabled={findAllEquipmentBrands.isLoading}
    >
      <Stack sx={{ padding: 3, gap: 2 }}>
        <Loadable
          isLoading={findAllEquipmentBrands.isLoading}
          LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
          LoadedComponent={
            <FormControl fullWidth>
              <Controller
                name="brandId"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const equipmentBrands = findAllEquipmentBrands.data ?? []
                  const brandNames = ["", ...equipmentBrands.map((item) => item.name)]

                  const selectedId =
                    equipmentBrands.find((item) => item.id === field.value)?.name || ""

                  return (
                    <Select
                      ref={field.ref}
                      inputRef={brandInputRef}
                      label="Marca"
                      data={brandNames}
                      value={selectedId}
                      onChange={(selectedName) => {
                        const selectedItem = equipmentBrands.find(
                          (item) => item.name === selectedName
                        )
                        field.onChange(selectedItem?.id || "")
                      }}
                      error={!!errors.brandId}
                      helperText={errors.brandId?.message}
                    />
                  )
                }}
              />
            </FormControl>
          }
        />
        <FormControl fullWidth>
          <TextField
            {...register("name")}
            label="Nome"
            error={!!errors.name}
            helperText={errors.name?.message}
            autoComplete="off"
          />
        </FormControl>
      </Stack>
    </Modal>
  )
}

export default EquipmentModelAddModal
