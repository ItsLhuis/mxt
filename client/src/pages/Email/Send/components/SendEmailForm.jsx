import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { emailSchema } from "@schemas/email"

import { useClient } from "@hooks/server/useClient"
import { useEmail } from "@hooks/server/useEmail"

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
import { Email, Search } from "@mui/icons-material"

import { HeaderSection, RichEditor, FileUpload, Modal, Caption } from "@components/ui"

const SendEmailForm = () => {
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(emailSchema),
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
  const { sendEmail } = useEmail()

  const onSubmit = async (data) => {
    await sendEmail.mutateAsync({ ...data, text: data.subject }).then(() => navigate("/email/list"))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ marginTop: 3, gap: 3 }}>
          <Paper elevation={1}>
            <HeaderSection
              title="Detalhes"
              description="Para, assunto, título,... do e-mail"
              icon={<Email />}
            />
            <Stack sx={{ padding: 3, gap: 2 }}>
              <FormControl fullWidth>
                <TextField
                  label="Para"
                  placeholder="Selecione o e-mail de um cliente"
                  value={
                    clientModal.client.name
                      ? `${clientModal.contact.name} (${clientModal.client.name})`
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
                  {...register("subject")}
                  label="Assunto"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  autoComplete="off"
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("title")}
                  label="Título"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  autoComplete="off"
                />
              </FormControl>
              <Controller
                name="message"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RichEditor
                    label="Mensagem"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    shouldImmediatelyRender
                  />
                )}
              />
              <Controller
                name="attachments"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FileUpload
                    label="Anexos"
                    acceptedFiles=""
                    maxTotalFileSize={20 * 1024 * 1024}
                    disabled={sendEmail.isPending}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.attachments}
                    helperText={errors.attachments?.message}
                  />
                )}
              />
              <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
                <LoadingButton loading={sendEmail.isPending} type="submit" variant="contained">
                  Enviar E-mail
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
            filteredContacts: client.contacts.filter((contact) => contact.type === "E-mail")
          })) ?? []
        }
        searchKeys={["name", "contacts.contact"]}
        isLoading={findAllClients.isLoading}
        title="E-mails dos Clientes"
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
                .filter((contact) => contact.type === "E-mail")
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
                        {contact.contact}
                      </Typography>
                      {contact.description && <Caption title={contact.description} />}
                    </Stack>
                  </Button>
                ))}
              {item.contacts.filter((contact) => contact.type === "E-mail").length === 0 && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "var(--outline)", margin: 1, marginTop: 0 }}
                >
                  Não há contactos de e-mail disponíveis!
                </Typography>
              )}
            </Stack>
          </Stack>
        )}
      />
    </>
  )
}

export default SendEmailForm
