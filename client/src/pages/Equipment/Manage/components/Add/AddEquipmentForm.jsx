import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useForm, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { equipmentSchema } from "@schemas/equipment"

import { useClient } from "@hooks/server/useClient"
import { useEquipment } from "@hooks/server/useEquipment"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Stack,
  FormControl,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Tooltip,
  Skeleton,
  Typography
} from "@mui/material"
import { Computer, Search } from "@mui/icons-material"

import { HeaderSection, Modal, Loadable, Select, RichEditor, Caption } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const AddEquipmentForm = () => {
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(equipmentSchema)
  })

  const { findAllClients } = useClient()
  const {
    findAllEquipmentTypes,
    findAllEquipmentBrands,
    findAllEquipmentModelsByBrandId,
    createNewEquipment
  } = useEquipment()
  const {
    data: modelsByBrandId,
    isLoading: isModelsByBrandIdLoading,
    isError: isModelsByBrandIdError
  } = findAllEquipmentModelsByBrandId(useWatch({ control, name: "brandId" }))

  const [clientModal, setClientModal] = useState({
    isOpen: false,
    client: { id: null, name: "" }
  })
  const openClientModal = () => {
    setClientModal((prev) => ({ ...prev, isOpen: true }))
  }
  const closeClientModal = () => {
    setClientModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSelectClient = (id, name) => {
    setClientModal({ client: { id: id, name: name } })
    setValue("clientId", id)
  }

  const onSubmit = async (data) => {
    await createNewEquipment
      .mutateAsync({
        ...data,
        description: data.description === "" ? null : data.description
      })
      .then(() => {
        navigate("/equipment/list")
        showSuccessToast("Equipamento adicionado com sucesso!")
      })
      .catch((error) => {
        if (error.error.code === "EQU-008") {
          setError("sn", {
            type: "manual",
            message: "Número de série já existente"
          })
          return
        }

        showErrorToast("Erro ao adicionar equipamento!")
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ marginTop: 3, gap: 3 }}>
          <Paper elevation={1}>
            <HeaderSection
              title="Detalhes"
              description="Cliente, tipo, marca, modelo,... do equipamento"
              icon={<Computer />}
            />
            <Stack sx={{ padding: 3, gap: 2 }}>
              <FormControl fullWidth>
                <TextField
                  label="Cliente"
                  placeholder="Selecione um cliente"
                  value={clientModal.client.name}
                  onClick={openClientModal}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip>
                          <IconButton onClick={openClientModal}>
                            <Search />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  error={!!errors.clientId}
                  helperText={errors.clientId?.message}
                />
              </FormControl>
              <Loadable
                isLoading={findAllEquipmentTypes.isLoading}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="typeId"
                      control={control}
                      defaultValue=""
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
                isLoading={isModelsByBrandIdLoading || isModelsByBrandIdError}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="modelId"
                      control={control}
                      defaultValue=""
                      render={({ field }) => {
                        const equipmentModelsByBrandId = modelsByBrandId ?? []
                        const modelsByBrandIdNames = [
                          "",
                          ...equipmentModelsByBrandId.map((item) => item.name)
                        ]

                        const selectedId =
                          equipmentModelsByBrandId.find((item) => item.id === field.value)?.name ||
                          ""

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
              <FormControl fullWidth>
                <TextField
                  {...register("sn")}
                  label="Número de série"
                  error={!!errors.sn}
                  helperText={errors.sn?.message}
                  autoComplete="off"
                />
              </FormControl>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RichEditor label="Descrição" value={field.value} onChange={field.onChange} />
                )}
              />
              <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
                <LoadingButton
                  loading={createNewEquipment.isPending}
                  type="submit"
                  variant="contained"
                >
                  Adicionar Equipamento
                </LoadingButton>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </form>
      <Modal
        open={clientModal.isOpen ?? false}
        onClose={closeClientModal}
        mode="data"
        data={findAllClients.data ?? []}
        isLoading={findAllClients.isLoading}
        title="Clientes"
        placeholder="Pesquise por um cliente"
        buttonStructure={(item, onClose) => (
          <Button
            variant="contained"
            color="secondary"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "16px !important",
              width: "100%",
              minHeight: "unset !important",
              border: 2,
              borderColor:
                item.id === clientModal.client.id ? "var(--primary)" : "var(--elevation-level3)",
              borderRadius: 2,
              color: "var(--onSurface)",
              lineHeight: 1.5,
              fontWeight: 400,
              "&:hover": {
                borderColor: "var(--primary)"
              }
            }}
            onClick={() => {
              handleSelectClient(item.id, item.name)
              onClose()
            }}
          >
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
              <Typography
                variant="p"
                component="p"
                sx={{ wordBreak: "break-all", textAlign: "start" }}
              >
                {item.name}
              </Typography>
              {item.description && <Caption fontSize="small" title={item.description} />}
            </Stack>
          </Button>
        )}
      />
    </>
  )
}

export default AddEquipmentForm
