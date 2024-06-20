import React from "react"

import { useNavigate } from "react-router-dom"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField } from "@mui/material"

import { HeaderSection, RichEditor, Select } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EditClient = () => {
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(clientSchema)
  })

  const { createNewClient } = useClient()

  const onSubmit = async (data) => {
    await createNewClient
      .mutateAsync(data)
      .then(() => {
        navigate("/client/list")
        showSuccessToast("Cliente criado com sucesso!")
      })
      .catch(() => showErrorToast("Erro ao criar cliente!"))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ marginTop: 3, gap: 3, marginLeft: "auto", marginRight: "auto", maxWidth: 900 }}>
        <Paper elevation={1}>
          <Box>
            <HeaderSection title="Detalhes" description="Nome e descrição do cliente" />
            <Stack sx={{ padding: 3, gap: 3 }}>
              <FormControl fullWidth>
                <TextField
                  {...register("name")}
                  label="Nome"
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
              <Box sx={{ marginLeft: "auto" }}>
                <LoadingButton
                  loading={createNewClient.isPending}
                  type="submit"
                  variant="contained"
                >
                  Atualizar Detalhes
                </LoadingButton>
              </Box>
            </Stack>
          </Box>
        </Paper>
        <Paper elevation={1}>
          <Box>
            <HeaderSection title="Contacto" description="Contactos do cliente" />
            <Stack sx={{ padding: 3, gap: 3 }}>
              <FormControl fullWidth>
                <Controller
                  name="contactType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      ref={field.ref}
                      label="Tipo"
                      data={["", "E-mail", "Telefone", "Telemóvel", "Outro"]}
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.contactType}
                      helperText={errors.contactType?.message}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("contact")}
                  label="Contacto"
                  error={!!errors.contact}
                  helperText={errors.contact?.message}
                />
              </FormControl>
              <Controller
                name="contactDescription"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RichEditor label="Descrição" value={field.value} onChange={field.onChange} />
                )}
              />
            </Stack>
          </Box>
        </Paper>
        <Paper elevation={1}>
          <Box>
            <HeaderSection title="Morada" description="Moradas do cliente" />
            <Stack sx={{ padding: 3, gap: 3 }}>
              <FormControl fullWidth>
                <TextField
                  {...register("country")}
                  label="País"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("city")}
                  label="Cidade"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("locality")}
                  label="Localidade"
                  error={!!errors.locality}
                  helperText={errors.locality?.message}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("address")}
                  label="Morada"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("postalCode")}
                  label="Código postal"
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                />
              </FormControl>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </form>
  )
}

export default EditClient
