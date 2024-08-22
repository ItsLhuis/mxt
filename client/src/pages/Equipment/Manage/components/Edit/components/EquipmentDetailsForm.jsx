import React, { useEffect } from "react"

import { useForm, useFormState, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateEquipmentSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { Link } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField, Typography, Skeleton } from "@mui/material"

import { HeaderSection, Loadable, Select, RichEditor, Caption } from "@components/ui"
import { Computer } from "@mui/icons-material"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EquipmentDetailsForm = ({ equipment, isLoading, isError }) => {
  const isEquipmentFinished = !isLoading && !isError

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(updateEquipmentSchema)
  })

  const initialValues = {
    typeId: equipment?.[0]?.type?.id || "",
    brandId: equipment?.[0]?.brand?.id || "",
    modelId: equipment?.[0]?.model?.id || "",
    sn: equipment?.[0]?.sn || "",
    description: equipment?.[0]?.description || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
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
  } = findAllEquipmentModelsByBrandId(
    useWatch({ control, name: "brandId", defaultValue: equipment?.[0]?.brand?.id })
  )

  const onSubmit = async (data) => {
    if (!isEquipmentFinished || isFormUnchanged()) return

    await updateEquipment
      .mutateAsync({
        equipmentId: equipment[0].id,
        ...data,
        description: data.description === "" ? null : data.description
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
        icon={<Computer />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, paddingTop: 2, gap: 2 }}>
          <Loadable
            isLoading={!isEquipmentFinished}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
              <Stack>
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "var(--outline)", fontWeight: 550 }}
                >
                  Cliente
                </Typography>
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                  <Typography variant="p" component="p">
                    <Link to={`/client/${equipment?.[0]?.client?.id}`}>
                      {equipment?.[0]?.client?.name}
                    </Link>
                  </Typography>
                  {equipment?.[0]?.client?.description && (
                    <Caption fontSize="small" title={equipment?.[0]?.client?.description} />
                  )}
                </Stack>
              </Stack>
            }
          />
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
            isLoading={!isEquipmentFinished || (isModelsByBrandIdLoading && isModelsByBrandIdError)}
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
                  autoComplete="off"
                  InputLabelProps={{ shrink: getValues("sn")?.length > 0 }}
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
