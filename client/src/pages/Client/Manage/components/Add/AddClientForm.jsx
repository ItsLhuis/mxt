import React from "react"

import { useNavigate } from "react-router-dom"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField } from "@mui/material"

import { HeaderSection, RichEditor } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const AddClientForm = () => {
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
            </Stack>
          </Box>
        </Paper>
        <Box sx={{ marginLeft: "auto" }}>
          <LoadingButton loading={createNewClient.isPending} type="submit" variant="contained">
            Criar Cliente
          </LoadingButton>
        </Box>
      </Stack>
    </form>
  )
}

export default AddClientForm
