import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientContactSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { MuiTelInput } from "mui-tel-input"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, FormControl, TextField } from "@mui/material"
import { Place } from "@mui/icons-material"

import { HeaderSection, Select, RichEditor } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const ClientAddressForm = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    resetField,
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
        ...data
      })
      .then(() => {
        reset()
        showSuccessToast("Contacto criado com sucesso!")
      })
      .catch((error) => {
        if (error.error.code === "CLI-002") {
          setError("contact", {
            type: "manual",
            message: "Já existe um contacto com o mesmo tipo e valor para este cliente"
          })
          return
        }

        showErrorToast("Erro ao criar contacto!")
      })
  }

  const watchType = watch("type", "")

  useEffect(() => {
    if (watchType === "Telefone" || watchType === "Telemóvel") {
      setValue("contact", "+351")
    } else {
      resetField("contact")
    }
  }, [watchType, setValue, resetField])

  return (
    <Stack>
      <HeaderSection title="Morada" description="Adicionar nova morada ao cliente" icon={<Place />} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 3 }}>
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
                        value={field.value || "+"}
                        defaultCountry={"pt"}
                        label={watchType}
                        variant="outlined"
                        fullWidth
                        error={!!errors.contact}
                        helperText={errors.contact?.message}
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
              <RichEditor label="Descrição" value={field.value} onChange={field.onChange} />
            )}
          />
          <Box sx={{ marginLeft: "auto" }}>
            <LoadingButton
              loading={addNewContactClient.isPending}
              type="submit"
              variant="contained"
              disabled={!isClientFinished}
            >
              Adicionar Morada
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}

export default ClientAddressForm
