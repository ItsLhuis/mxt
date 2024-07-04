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

import { sanitizeHTML } from "@utils/sanitizeHTML"

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

  const isFormUnchanged = () => {
    const values = watch()
    return (
      values.name === initialValues.name &&
      (sanitizeHTML(values.description) === "" ? "" : values.description) ===
        initialValues.description
    )
  }

  useEffect(() => {
    if (isClientFinished && client && client[0]) {
      reset(initialValues)
    }
  }, [isClientFinished, client])

  const { updateClient } = useClient()

  const onSubmit = async (data) => {
    if (!isClientFinished || isFormUnchanged()) return

    await updateClient
      .mutateAsync({
        clientId: client[0].id,
        ...data,
        description: sanitizeHTML(data.description) === "" ? null : data.description
      })
      .then(() => showSuccessToast("Cliente atualizado com sucesso!"))
      .catch(() => showErrorToast("Erro ao atualizar cliente!"))
  }

  return (
    <Paper elevation={1}>
      <HeaderSection title="Detalhes" description="Nome e descrição do cliente" icon={<Person />} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 2 }}>
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
                  InputLabelProps={{ shrink: watch("name")?.length > 0 }}
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
          <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
            <LoadingButton
              loading={updateClient.isPending}
              type="submit"
              variant="contained"
              disabled={!isClientFinished || isFormUnchanged()}
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
