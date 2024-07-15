import React, { useEffect, useRef } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { modelSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Stack, FormControl, TextField, Skeleton } from "@mui/material"

import { Modal, Loadable, Select } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentModelEditModal = ({ model, open, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      brandId: "",
      name: ""
    }
  })

  const { findAllEquipmentBrands, updateEquipmentModel } = useEquipment()

  const brandInputRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      if (open && brandInputRef.current) {
        brandInputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (model) {
      reset({
        brandId: model.brand.id || "",
        name: model.name || ""
      })
    }
  }, [model])

  const isFormUnchanged = () => {
    const values = watch()
    return values.name === model?.name
  }

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateEquipmentModel
          .mutateAsync({ brandId: model.brand.id, modelId: model.id, ...data })
          .then(() => {
            onClose()
            showSuccessToast("Marca atualizada com sucesso!")
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "EQU-005") {
              setError("name", {
                model: "manual",
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
      title="Editar Modelo"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Modelo"
      onSubmit={handleSubmit(onSubmit)}
      disabled={findAllEquipmentBrands.isLoading || isFormUnchanged()}
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
            InputLabelProps={{ shrink: watch("name")?.length > 0 }}
          />
        </FormControl>
      </Stack>
    </Modal>
  )
}

export default EquipmentModelEditModal
