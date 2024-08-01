import React from "react"

import { useNavigate } from "react-router-dom"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField } from "@mui/material"
import { Person } from "@mui/icons-material"

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
      .mutateAsync({
        ...data,
        description: data.description === "" ? null : data.description
      })
      .then(() => {
        navigate("/client/list")
        showSuccessToast("Cliente adicionado com sucesso!")
      })
      .catch(() => showErrorToast("Erro ao adicionar cliente!"))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ marginTop: 3, gap: 3 }}>
        <Paper elevation={1}>
          <HeaderSection
            title="Detalhes"
            description="Nome e descrição do cliente"
            icon={<Person />}
          />
          <Stack sx={{ padding: 3, gap: 2 }}>
            <FormControl fullWidth>
              <TextField
                {...register("name")}
                label="Nome"
                error={!!errors.name}
                helperText={errors.name?.message}
                autoComplete="off"
              />
            </FormControl>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RichEditor label="Descrição" value={field.value} onChange={field.onChange} shouldImmediatelyRender />
              )}
            />
            <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
              <LoadingButton loading={createNewClient.isPending} type="submit" variant="contained">
                Adicionar Cliente
              </LoadingButton>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </form>
  )
}

export default AddClientForm
