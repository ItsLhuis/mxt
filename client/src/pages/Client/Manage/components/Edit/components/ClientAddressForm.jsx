import React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientAddressSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { LoadingButton } from "@mui/lab"
import { Grid, Box, Stack, FormControl, TextField, useTheme, useMediaQuery } from "@mui/material"
import { Place } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const ClientAddressForm = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(clientAddressSchema)
  })

  const { addNewAddressClient } = useClient()

  const onSubmit = async (data) => {
    if (!isClientFinished) return

    await addNewAddressClient
      .mutateAsync({
        clientId: client[0].id,
        ...data
      })
      .then(() => {
        reset()
        showSuccessToast("Morada adicionada com sucesso!")
      })
      .catch((error) => {
        if (error.error.code === "CLI-004") {
          const fields = ["country", "city", "locality", "address", "postalCode"]
          fields.forEach((field) => {
            setError(field, {
              type: "manual",
              message: "Já existe uma morada com os mesmos valores para este cliente"
            })
          })
          return
        }

        showErrorToast("Erro ao adicionar morada!")
      })
  }

  return (
    <Stack>
      <HeaderSection
        title="Morada"
        description="Adicionar nova morada ao cliente"
        icon={<Place />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Grid container spacing={2} sx={{ paddingInline: 3 }}>
            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <TextField
                  {...register("country")}
                  label="País"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  autoComplete="off"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <TextField
                  {...register("city")}
                  label="Cidade"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  autoComplete="off"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <TextField
                  {...register("locality")}
                  label="Localidade"
                  error={!!errors.locality}
                  helperText={errors.locality?.message}
                  autoComplete="off"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Stack sx={{ flexDirection: isSmallScreen ? "column" : "row", gap: 2 }}>
                <FormControl fullWidth>
                  <TextField
                    {...register("address")}
                    label="Morada"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    autoComplete="off"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    {...register("postalCode")}
                    label="Código Postal"
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                    autoComplete="off"
                  />
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ marginLeft: "auto", padding: 3 }}>
            <LoadingButton
              loading={addNewAddressClient.isPending}
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
