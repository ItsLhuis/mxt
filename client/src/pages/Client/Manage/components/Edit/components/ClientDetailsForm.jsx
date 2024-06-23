import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField, Skeleton } from "@mui/material"

import { HeaderSection, Loadable, RichEditor } from "@components/ui"
import { Person } from "@mui/icons-material"

const ClientDetailsForm = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(clientSchema)
  })

  const initialValues = {
    name: client?.[0]?.name || "",
    description: client?.[0]?.description || ""
  }

  const isFormUnchanged =
    watch().name === initialValues.name && watch().description === initialValues.description

  useEffect(() => {
    if (isClientFinished && client && client[0]) {
      reset(initialValues)
    }
  }, [isClientFinished, client])

  const { createNewClient } = useClient()

  const onSubmit = async (data) => {
    if (!isClientFinished || isFormUnchanged) return

    /*     await createNewClient
      .mutateAsync(data)
      .then(() => {
        navigate("/client/list")
        showSuccessToast("Cliente criado com sucesso!")
      })
      .catch(() => showErrorToast("Erro ao criar cliente!")) */
    console.log(client)
  }

  return (
    <Paper elevation={1}>
      <HeaderSection title="Detalhes" description="Nome e descrição do cliente" icon={<Person />} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 3 }}>
          <Loadable
            isLoading={!isClientFinished}
            LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
            LoadedComponent={
              <FormControl fullWidth>
                <TextField
                  {...register("name")}
                  label="Nome"
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                isLoading={!isClientFinished}
              />
            )}
          />
          <Box sx={{ marginLeft: "auto" }}>
            <LoadingButton
              /* loading={createNewClient.isPending} */
              type="submit"
              variant="contained"
              disabled={!isClientFinished || isFormUnchanged}
            >
              Atualizar Detalhes
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Paper>
  )
}

export default ClientDetailsForm
