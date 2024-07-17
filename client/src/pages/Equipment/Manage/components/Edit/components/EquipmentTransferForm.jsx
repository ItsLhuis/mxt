import React, { useState, useEffect } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateClientEquipmentSchema } from "@schemas/equipment"

import { useClient } from "@hooks/server/useClient"
import { useEquipment } from "@hooks/server/useEquipment"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Stack,
  FormControl,
  TextField,
  Skeleton,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Typography
} from "@mui/material"

import { HeaderSection, Loadable, Modal, Caption } from "@components/ui"
import { MoveUp, Search } from "@mui/icons-material"

const EquipmentTransferForm = ({ equipment, isLoading, isError }) => {
  const isEquipmentFinished = !isLoading && !isError

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(updateClientEquipmentSchema)
  })

  const { findAllClients } = useClient()

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

  const initialValues = {
    clientId: equipment?.[0]?.client?.id || ""
  }

  const isFormUnchanged = () => {
    const values = watch()
    return values.clientId === initialValues.clientId
  }

  useEffect(() => {
    if (isEquipmentFinished && equipment && equipment[0]) {
      setClientModal({ client: { id: equipment[0].client.id, name: equipment[0].client.name } })
      reset(initialValues)
    }
  }, [isEquipmentFinished, equipment])

  const { transferEquipment } = useEquipment()

  const onSubmit = async (data) => {
    if (!isEquipmentFinished || isFormUnchanged()) return

    await transferEquipment.mutateAsync({
      equipmentId: equipment[0].id,
      ...data
    })
  }

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Transferir"
        description="Mudar cliente do equipamento"
        icon={<MoveUp />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 2 }}>
          <Loadable
            isLoading={!isEquipmentFinished}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
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
            }
          />
          <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
            <LoadingButton
              loading={transferEquipment.isPending}
              type="submit"
              variant="contained"
              color="error"
              disabled={!isEquipmentFinished || isFormUnchanged()}
            >
              Transferir Equipamento
            </LoadingButton>
          </Box>
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
    </Paper>
  )
}

export default EquipmentTransferForm
