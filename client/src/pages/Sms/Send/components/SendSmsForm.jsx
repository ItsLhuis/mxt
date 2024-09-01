import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { smsSchema } from "@schemas/sms"

import { useClient } from "@hooks/server/useClient"
import { useSms } from "@hooks/server/useSms"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Stack,
  FormControl,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
  IconButton,
  Typography
} from "@mui/material"
import { Sms, Search } from "@mui/icons-material"

import { HeaderSection, Modal, Caption } from "@components/ui"

import { formatPhoneNumber } from "@utils/format/phone"

const SendSmsForm = () => {
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(smsSchema),
    defaultValues: {
      attachments: []
    }
  })

  const [clientModal, setClientModal] = useState({
    isOpen: false,
    client: { id: null, name: "" },
    contact: { id: null, name: "" }
  })
  const openClientModal = () => {
    setClientModal((prev) => ({ ...prev, isOpen: true }))
  }
  const closeClientModal = () => {
    setClientModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSelectClient = (clientId, clientName, contactId, contactname) => {
    setClientModal({
      client: { id: clientId, name: clientName },
      contact: { id: contactId, name: contactname }
    })
    setValue("clientId", clientId)
    setValue("contactId", contactId)
  }

  const { findAllClients } = useClient()
  const { sendSms } = useSms()

  const onSubmit = async (data) => {
    await sendSms.mutateAsync(data).then(() => navigate("/sms/list"))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ marginTop: 3, gap: 3 }}>
          <Paper elevation={1}>
            <HeaderSection title="Detalhes" description="Para e mensagem do SMS" icon={<Sms />} />
            <Stack sx={{ padding: 3, gap: 2 }}>
              <FormControl fullWidth>
                <TextField
                  label="Para"
                  placeholder="Selecione o contacto de um cliente"
                  value={
                    clientModal.client.name
                      ? `${formatPhoneNumber(clientModal.contact.name)} (${
                          clientModal.client.name
                        })`
                      : ""
                  }
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
              <FormControl fullWidth>
                <TextField
                  {...register("message")}
                  label="Mensagem"
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  autoComplete="off"
                  multiline
                  rows={14}
                />
              </FormControl>
              <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
                <LoadingButton loading={sendSms.isPending} type="submit" variant="contained">
                  Enviar SMS
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
        data={
          findAllClients.data?.map((client) => ({
            ...client,
            filteredContacts: client.contacts.filter(
              (contact) => contact.type === "Telemóvel" || contact.type === "Telefone"
            )
          })) ?? []
        }
        searchKeys={["name", "contacts.contact"]}
        isLoading={findAllClients.isLoading}
        title="Contactos dos Clientes"
        placeholder="Pesquise por um cliente"
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
                {item.name}
              </Typography>
              {item.description && <Caption title={item.description} />}
            </Stack>
            <Stack sx={{ padding: 1 }}>
              {item.contacts
                .filter((contact) => contact.type === "Telemóvel" || contact.type === "Telefone")
                .map((contact) => (
                  <Button
                    key={contact.id}
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
                        contact.id === clientModal.contact.id
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
                      handleSelectClient(item.id, item.name, contact.id, contact.contact)
                      onClose()
                    }}
                  >
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="p"
                        component="p"
                        sx={{ wordBreak: "break-all", textAlign: "start" }}
                      >
                        {formatPhoneNumber(contact.contact)}
                      </Typography>
                      {contact.description && (
                        <Caption title={contact.description} />
                      )}
                    </Stack>
                  </Button>
                ))}
              {item.contacts.filter(
                (contact) => contact.type === "Telemóvel" || contact.type === "Telefone"
              ).length === 0 && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "var(--outline)", margin: 1, marginTop: 0 }}
                >
                  Não há contactos de SMS disponíveis!
                </Typography>
              )}
            </Stack>
          </Stack>
        )}
      />
    </>
  )
}

export default SendSmsForm
