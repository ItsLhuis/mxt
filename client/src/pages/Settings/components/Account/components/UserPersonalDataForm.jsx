import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserPersonalDataSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { MuiTelInput } from "mui-tel-input"
import { LoadingButton } from "@mui/lab"
import {
  Grid,
  Box,
  Stack,
  FormControl,
  TextField,
  Skeleton,
  useTheme,
  useMediaQuery
} from "@mui/material"

import { HeaderSection, Loadable, RichEditor } from "@components/ui"

const UserPersonalDataForm = ({ user, isLoading, isError }) => {
  const isUserFinished = !isLoading && !isError

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(updateUserPersonalDataSchema)
  })

  const { updateUserPersonalData, findEmployeeByUserId } = useUser()
  const {
    data: userPersonalData,
    isLoading: isUserPersonalDataLoading,
    isError: isUserPersonalDataError
  } = findEmployeeByUserId(user?.id)

  const isUserPersonalDataFinished = !isUserPersonalDataLoading && !isUserPersonalDataError

  const initialValues = {
    name: userPersonalData?.name || "",
    phoneNumber: userPersonalData?.phone_number || "",
    country: userPersonalData?.country || "",
    city: userPersonalData?.city || "",
    locality: userPersonalData?.locality || "",
    address: userPersonalData?.address || "",
    postalCode: userPersonalData?.postal_code || "",
    description: userPersonalData?.description || ""
  }

  const isAllUserDataFinished =
    isUserFinished && user && isUserPersonalDataFinished && userPersonalData

  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (isAllUserDataFinished) {
      reset(initialValues)
    }
  }, [isAllUserDataFinished])

  const onSubmit = async (data) => {
    if (!isAllUserDataFinished || isFormUnchanged() || updateUserPersonalData.isPending) return

    await updateUserPersonalData.mutateAsync({
      userId: user.id,
      ...data,
      description: data.description === "" ? null : data.description
    })
  }

  return (
    <>
      <HeaderSection title="Dados Pessoais" description="Atualizar dados pessoais do utilizador" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ paddingTop: 1 }}>
          <Grid container spacing={2} sx={{ paddingInline: 3 }}>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isAllUserDataFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nome"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          autoComplete="off"
                          disabled={updateUserPersonalData.isPending}
                        />
                      )}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isAllUserDataFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      defaultValue="+351"
                      render={({ field }) => (
                        <MuiTelInput
                          {...field}
                          value={field.value || "+351"}
                          onChange={(value) => {
                            field.onChange(value.replace(/\s+/g, ""))
                          }}
                          defaultCountry={"pt"}
                          label="Contacto"
                          variant="outlined"
                          fullWidth
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber?.message}
                          autoComplete="off"
                          disabled={updateUserPersonalData.isPending}
                          disableDropdown
                        />
                      )}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isAllUserDataFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="country"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="País"
                          error={!!errors.country}
                          helperText={errors.country?.message}
                          autoComplete="off"
                          disabled={updateUserPersonalData.isPending}
                        />
                      )}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isAllUserDataFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="city"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Cidade"
                          error={!!errors.city}
                          helperText={errors.city?.message}
                          autoComplete="off"
                          disabled={updateUserPersonalData.isPending}
                        />
                      )}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isAllUserDataFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="locality"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Localidade"
                          error={!!errors.locality}
                          helperText={errors.locality?.message}
                          autoComplete="off"
                          disabled={updateUserPersonalData.isPending}
                        />
                      )}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Stack sx={{ flexDirection: isSmallScreen ? "column" : "row", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <Loadable
                    isLoading={!isAllUserDataFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Controller
                          name="address"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Morada"
                              error={!!errors.address}
                              helperText={errors.address?.message}
                              autoComplete="off"
                              disabled={updateUserPersonalData.isPending}
                            />
                          )}
                        />
                      </FormControl>
                    }
                  />
                </Box>
                <Box sx={{ width: !isSmallScreen ? "60%" : "100%" }}>
                  <Loadable
                    isLoading={!isAllUserDataFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Controller
                          name="postalCode"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Código Postal"
                              error={!!errors.postalCode}
                              helperText={errors.postalCode?.message}
                              autoComplete="off"
                              disabled={updateUserPersonalData.isPending}
                            />
                          )}
                        />
                      </FormControl>
                    }
                  />
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RichEditor
                    value={field.value}
                    onChange={field.onChange}
                    isLoading={!isAllUserDataFinished}
                    disabled={updateUserPersonalData.isPending}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ marginLeft: "auto", padding: 3 }}>
            <LoadingButton
              loading={updateUserPersonalData.isPending}
              type="submit"
              variant="contained"
              sx={{ marginLeft: "auto" }}
              disabled={
                !isAllUserDataFinished || isFormUnchanged() || updateUserPersonalData.isPending
              }
            >
              Atualizar Dados Pessoais
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </>
  )
}

export default UserPersonalDataForm
