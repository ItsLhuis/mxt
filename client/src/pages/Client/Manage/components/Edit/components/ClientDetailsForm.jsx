import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Stack, FormControl, TextField, Skeleton } from "@mui/material"

import { HeaderSection, Loadable, RichEditor } from "@components/ui"
import { Person } from "@mui/icons-material"

import { showSuccessToast, showErrorToast } from "@config/toast"

const ClientDetailsForm = ({ client, isLoading, isError }) => {
  const isFinished = !isLoading && !isError

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(clientSchema)
  })

  useEffect(() => {
    if (isFinished && client && client[0]) {
      reset({
        name: client[0].name || "",
        description: client[0].description || ""
      })
    }
  }, [isFinished, client])

  const { createNewClient } = useClient()

  const onSubmit = async (data) => {
    if (!isFinished) return

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
            isLoading={!isFinished}
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
                isLoading={!isFinished}
              />
            )}
          />
          <Box sx={{ marginLeft: "auto" }}>
            <LoadingButton
              /* loading={createNewClient.isPending} */
              type="submit"
              variant="contained"
              disabled={!isFinished}
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
