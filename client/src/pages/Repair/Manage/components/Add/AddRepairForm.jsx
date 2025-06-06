import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { repairSchema } from "@schemas/repair"

import { useEquipment } from "@hooks/server/useEquipment"
import { useRepair } from "@hooks/server/useRepair"

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
  Typography,
  Skeleton
} from "@mui/material"
import { Construction, Search } from "@mui/icons-material"

import {
  HeaderSection,
  Modal,
  RichEditor,
  DatePicker,
  Loadable,
  Select,
  Caption
} from "@components/ui"

const AddRepairForm = () => {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(repairSchema)
  })

  const [equipmentModal, setEquipmentModal] = useState({
    isOpen: false,
    equipment: {
      id: null,
      clientName: "",
      typeName: "",
      brandName: "",
      modelName: ""
    }
  })
  const openEquipmentModal = () => {
    setEquipmentModal((prev) => ({ ...prev, isOpen: true }))
  }
  const closeEquipmentModal = () => {
    setEquipmentModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSelectEquipment = (id, clientName, typeName, brandName, modelName) => {
    setEquipmentModal({
      equipment: {
        id: id,
        clientName: clientName,
        typeName: typeName,
        brandName: brandName,
        modelName: modelName
      }
    })
    setValue("equipmentId", id)
  }

  const { findAllEquipments } = useEquipment()
  const { createNewRepair, findAllRepairStatuses } = useRepair()

  const onSubmit = async (data) => {
    await createNewRepair
      .mutateAsync({
        ...data,
        entryDescription: data.entryDescription === "" ? null : data.entryDescription
      })
      .then(() => navigate("/repair/list"))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ marginTop: 3, gap: 3 }}>
          <Paper elevation={1}>
            <HeaderSection
              title="Detalhes"
              description="Estado, equipamento, data da entrada,... da reparação"
              icon={<Construction />}
            />
            <Stack sx={{ padding: 3, gap: 2 }}>
              <Loadable
                isLoading={findAllRepairStatuses.isLoading}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="statusId"
                      control={control}
                      defaultValue=""
                      render={({ field }) => {
                        const equipmentStatuses = findAllRepairStatuses.data ?? []
                        const statusNames = ["", ...equipmentStatuses.map((item) => item.name)]

                        const selectedId =
                          equipmentStatuses.find((item) => item.id === field.value)?.name || ""

                        return (
                          <Select
                            ref={field.ref}
                            label="Estado"
                            data={statusNames}
                            value={selectedId}
                            onChange={(selectedName) => {
                              const selectedItem = equipmentStatuses.find(
                                (item) => item.name === selectedName
                              )
                              field.onChange(selectedItem?.id || "")
                            }}
                            error={!!errors.statusId}
                            helperText={errors.statusId?.message}
                          />
                        )
                      }}
                    />
                  </FormControl>
                }
              />
              <FormControl fullWidth>
                <TextField
                  label="Equipamento"
                  placeholder="Selecione um equipamento"
                  value={
                    equipmentModal.equipment.clientName
                      ? `${equipmentModal.equipment.typeName}, ${equipmentModal.equipment.brandName} ${equipmentModal.equipment.modelName} (${equipmentModal.equipment.clientName})`
                      : ""
                  }
                  onClick={openEquipmentModal}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip>
                          <IconButton onClick={openEquipmentModal}>
                            <Search />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  error={!!errors.equipmentId}
                  helperText={errors.equipmentId?.message}
                />
              </FormControl>
              <Controller
                name="entryDatetime"
                control={control}
                defaultValue={new Date()}
                render={({ field }) => (
                  <DatePicker
                    label="Data de entrada"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.entryDatetime}
                    helperText={errors.entryDatetime?.message}
                  />
                )}
              />
              <Controller
                name="entryDescription"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RichEditor
                    label="Descrição da entrada"
                    value={field.value}
                    onChange={field.onChange}
                    shouldImmediatelyRender
                  />
                )}
              />
              <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
                <LoadingButton
                  loading={createNewRepair.isPending}
                  type="submit"
                  variant="contained"
                >
                  Adicionar Reparação
                </LoadingButton>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </form>
      <Modal
        open={equipmentModal.isOpen ?? false}
        onClose={closeEquipmentModal}
        mode="data"
        data={findAllEquipments.data ?? []}
        searchKeys={["client.name", "type.name", "brand.name", "model.name"]}
        isLoading={findAllEquipments.isLoading}
        title="Equipamentos"
        placeholder="Pesquise por um equipamento"
        buttonStructure={(item, onClose) => (
          <Stack sx={{ border: "2px solid var(--elevation-level5)", borderRadius: "8px" }}>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                marginInline: 2,
                marginTop: 2
              }}
            >
              <Typography
                variant="h5"
                component="h5"
                sx={{ wordBreak: "break-all", textAlign: "start" }}
              >
                {item.client.name}
              </Typography>
              {item.client.description && <Caption title={item.client.description} />}
            </Stack>
            <Stack sx={{ padding: 1 }}>
              {findAllEquipments.data
                ?.filter((equipment) => equipment.client.name === item.client.name)
                .map((equipment) => (
                  <Button
                    key={equipment.id}
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
                        equipment.id === equipmentModal.equipment.id
                          ? "var(--primary)"
                          : "var(--elevation-level3)",
                      borderRadius: 2,
                      color: "var(--onSurface)",
                      lineHeight: 1.5,
                      fontWeight: 400,
                      marginTop: 1,
                      "&:hover": {
                        borderColor: "var(--primary)"
                      }
                    }}
                    onClick={() => {
                      handleSelectEquipment(
                        equipment.id,
                        equipment.client.name,
                        equipment.type.name,
                        equipment.brand.name,
                        equipment.model.name
                      )
                      onClose()
                    }}
                  >
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="p"
                        component="p"
                        sx={{ wordBreak: "break-all", textAlign: "start" }}
                      >
                        {equipment.type.name}, {equipment.brand.name} {equipment.model.name}
                      </Typography>
                      {equipment.description && <Caption title={equipment.description} />}
                    </Stack>
                  </Button>
                ))}
              {findAllEquipments.data?.filter(
                (equipment) => equipment.client.name === item.client.name
              ).length === 0 && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "var(--outline)", margin: 1, marginTop: 0 }}
                >
                  Não há equipamentos disponíveis para este cliente!
                </Typography>
              )}
            </Stack>
          </Stack>
        )}
      />
    </>
  )
}

export default AddRepairForm
