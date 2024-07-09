import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateEquipmentSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField, Skeleton } from "@mui/material"

import { HeaderSection, Loadable, Select, RichEditor } from "@components/ui"
import { AppsOutlined } from "@mui/icons-material"

import { showSuccessToast, showErrorToast } from "@config/toast"

import { sanitizeHTML } from "@utils/sanitizeHTML"

const EquipmentDetailsForm = ({ equipment, isLoading, isError }) => {
  const isEquipmentFinished = !isLoading && !isError

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm({
    resolver: zodResolver(updateEquipmentSchema)
  })

  const initialValues = {
    typeId: equipment?.[0]?.type.id || "",
    brandId: equipment?.[0]?.brand.id || "",
    modelId: equipment?.[0]?.model.id || "",
    sn: equipment?.[0]?.sn || "",
    description: equipment?.[0]?.description || ""
  }

  const isFormUnchanged = () => {
    const values = watch()
    return (
      values.typeId === initialValues.typeId &&
      values.brandId === initialValues.brandId &&
      values.modelId === initialValues.modelId &&
      values.sn === initialValues.sn &&
      (sanitizeHTML(values.description) === "" ? "" : values.description) ===
        initialValues.description
    )
  }

  useEffect(() => {
    if (isEquipmentFinished && equipment && equipment[0]) {
      reset(initialValues)
    }
  }, [isEquipmentFinished, equipment])

  const {
    findAllEquipmentTypes,
    findAllEquipmentBrands,
    findAllEquipmentModelsByBrandId,
    updateEquipment
  } = useEquipment()
  const {
    data: modelsByBrandId,
    isLoading: isModelsByBrandIdLoading,
    isError: isModelsByBrandIdError
  } = findAllEquipmentModelsByBrandId(watch("brandId"))

  const onSubmit = async (data) => {
    if (!isEquipmentFinished || isFormUnchanged()) return

    await updateEquipment
      .mutateAsync({
        equipmentId: equipment[0].id,
        ...data,
        description: sanitizeHTML(data.description) === "" ? null : data.description
      })
      .then(() => showSuccessToast("Equipamento atualizado com sucesso!"))
      .catch((error) => {
        if (error.error.code === "EQU-008") {
          setError("sn", {
            type: "manual",
            message: "Número de série já existente"
          })
          return
        }

        showErrorToast("Erro ao atualizar equipamento!")
      })
  }

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Detalhes"
        description="Cliente, tipo, marca, modelo,... do equipamento"
        icon={<AppsOutlined />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 2 }}>
          <Loadable
            isLoading={!isEquipmentFinished || findAllEquipmentTypes.isLoading}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
              <FormControl fullWidth>
                <Controller
                  name="typeId"
                  control={control}
                  render={({ field }) => {
                    const equipmentTypes = findAllEquipmentTypes.data ?? []
                    const typeNames = ["", ...equipmentTypes.map((item) => item.name)]

                    const selectedId =
                      equipmentTypes.find((item) => item.id === field.value)?.name || ""

                    return (
                      <Select
                        ref={field.ref}
                        label="Tipo"
                        data={typeNames}
                        value={selectedId}
                        onChange={(selectedName) => {
                          const selectedItem = equipmentTypes.find(
                            (item) => item.name === selectedName
                          )
                          field.onChange(selectedItem?.id || "")
                        }}
                        error={!!errors.typeId}
                        helperText={errors.typeId?.message}
                      />
                    )
                  }}
                />
              </FormControl>
            }
          />
          <Loadable
            isLoading={!isEquipmentFinished || findAllEquipmentBrands.isLoading}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
              <FormControl fullWidth>
                <Controller
                  name="brandId"
                  control={control}
                  render={({ field }) => {
                    const equipmentBrands = findAllEquipmentBrands.data ?? []
                    const brandNames = ["", ...equipmentBrands.map((item) => item.name)]

                    const selectedId =
                      equipmentBrands.find((item) => item.id === field.value)?.name || ""

                    return (
                      <Select
                        ref={field.ref}
                        label="Marca"
                        data={brandNames}
                        value={selectedId}
                        onChange={(selectedName) => {
                          const selectedItem = equipmentBrands.find(
                            (item) => item.name === selectedName
                          )
                          field.onChange(selectedItem?.id || "")
                          setValue("modelId", "")
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
          <Loadable
            isLoading={!isEquipmentFinished || isModelsByBrandIdLoading || isModelsByBrandIdError}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
              <FormControl fullWidth>
                <Controller
                  name="modelId"
                  control={control}
                  render={({ field }) => {
                    const equipmentModelsByBrandId = modelsByBrandId ?? []
                    const modelsByBrandIdNames = [
                      "",
                      ...equipmentModelsByBrandId.map((item) => item.name)
                    ]

                    const selectedId =
                      equipmentModelsByBrandId.find((item) => item.id === field.value)?.name || ""

                    return (
                      <Select
                        ref={field.ref}
                        label="Modelo"
                        data={modelsByBrandIdNames}
                        value={selectedId}
                        onChange={(selectedName) => {
                          const selectedItem = equipmentModelsByBrandId.find(
                            (item) => item.name === selectedName
                          )
                          field.onChange(selectedItem?.id || "")
                        }}
                        error={!!errors.modelId}
                        helperText={errors.modelId?.message}
                      />
                    )
                  }}
                />
              </FormControl>
            }
          />
          <Loadable
            isLoading={!isEquipmentFinished}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
              <FormControl fullWidth>
                <TextField
                  {...register("sn")}
                  label="Número de série"
                  error={!!errors.sn}
                  helperText={errors.sn?.message}
                  InputLabelProps={{ shrink: watch("sn")?.length > 0 }}
                />
              </FormControl>
            }
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichEditor
                label="Descrição"
                value={field.value}
                onChange={field.onChange}
                isLoading={!isEquipmentFinished}
              />
            )}
          />
          <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
            <LoadingButton
              loading={updateEquipment.isPending}
              type="submit"
              variant="contained"
              disabled={!isEquipmentFinished || isFormUnchanged()}
            >
              Atualizar Equipamento
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Paper>
  )
}

export default EquipmentDetailsForm
