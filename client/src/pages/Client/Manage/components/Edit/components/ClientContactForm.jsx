import React from "react"

import { useForm, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientContactSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { MuiTelInput } from "mui-tel-input"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, FormControl, TextField } from "@mui/material"
import { Phone } from "@mui/icons-material"

import { HeaderSection, Select, RichEditor } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const ClientContactForm = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(clientContactSchema)
  })

  const { addNewContactClient } = useClient()

  const onSubmit = async (data) => {
    if (!isClientFinished) return

    await addNewContactClient
      .mutateAsync({
        clientId: client[0].id,
        ...data,
        description: data.description === "" ? null : data.description
      })
      .then(() => {
        reset()
        showSuccessToast("Contacto adicionado com sucesso!")
      })
      .catch((error) => {
        if (error.error.code === "CLI-002") {
          setError("contact", {
            type: "manual",
            message: "Já existe um contacto com o mesmo tipo e valor para este cliente"
          })
          return
        }

        showErrorToast("Erro ao adicionar contacto!")
      })
  }

  const watchType = useWatch({ control, name: "type" })

  return (
    <Stack>
      <HeaderSection
        title="Contacto"
        description="Adicionar novo contacto ao cliente"
        icon={<Phone />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 2 }}>
          <FormControl fullWidth>
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  ref={field.ref}
                  label="Tipo"
                  data={["", "E-mail", "Telefone", "Telemóvel", "Outro"]}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                />
              )}
            />
          </FormControl>
          {watchType === "E-mail" ? (
            <FormControl fullWidth>
              <TextField
                {...register("contact")}
                label="E-mail"
                error={!!errors.contact}
                helperText={errors.contact?.message}
                autoComplete="off"
              />
            </FormControl>
          ) : (
            <>
              {watchType === "Telefone" || watchType === "Telemóvel" ? (
                <FormControl fullWidth>
                  <Controller
                    name="contact"
                    control={control}
                    defaultValue="+351"
                    render={({ field }) => (
                      <MuiTelInput
                        {...field}
                        value={field.value || "+351"}
                        defaultCountry={"pt"}
                        label={watchType}
                        variant="outlined"
                        fullWidth
                        error={!!errors.contact}
                        helperText={errors.contact?.message}
                        autoComplete="off"
                        disableDropdown
                      />
                    )}
                  />
                </FormControl>
              ) : (
                <FormControl fullWidth>
                  <TextField
                    {...register("contact")}
                    label="Contacto"
                    error={!!errors.contact}
                    helperText={errors.contact?.message}
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </>
          )}
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RichEditor label="Descrição" value={field.value} onChange={field.onChange} shouldImmediatelyRender />
            )}
          />
          <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
            <LoadingButton
              loading={addNewContactClient.isPending}
              type="submit"
              variant="contained"
              disabled={!isClientFinished}
            >
              Adicionar Contacto
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}

export default ClientContactForm
