import React, { useEffect } from "react"

import { useForm, useFormState, Controller } from "react-hook-form"
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
    register,
    handleSubmit,
    getValues,
    formState: { errors },
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

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (isUserFinished && isUserPersonalDataFinished && userPersonalData && user) {
      reset(initialValues)
    }
  }, [isUserFinished, isUserPersonalDataFinished, userPersonalData, user])

  const onSubmit = async (data) => {
    if (!isUserFinished || !isUserPersonalDataFinished || isFormUnchanged()) return

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
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("name")}
                      label="Nome"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      autoComplete="off"
                      InputLabelProps={{ shrink: getValues("name")?.length > 0 }}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="phoneNumber"
                      control={control}
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
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("country")}
                      label="País"
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      autoComplete="off"
                      InputLabelProps={{ shrink: getValues("country")?.length > 0 }}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("city")}
                      label="Cidade"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      autoComplete="off"
                      InputLabelProps={{ shrink: getValues("city")?.length > 0 }}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("locality")}
                      label="Localidade"
                      error={!!errors.locality}
                      helperText={errors.locality?.message}
                      autoComplete="off"
                      InputLabelProps={{ shrink: getValues("locality")?.length > 0 }}
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Stack sx={{ flexDirection: isSmallScreen ? "column" : "row", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <Loadable
                    isLoading={!isUserFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <TextField
                          {...register("address")}
                          label="Morada"
                          error={!!errors.address}
                          helperText={errors.address?.message}
                          autoComplete="off"
                          InputLabelProps={{ shrink: getValues("address")?.length > 0 }}
                        />
                      </FormControl>
                    }
                  />
                </Box>
                <Box sx={{ width: !isSmallScreen ? "60%" : "100%" }}>
                  <Loadable
                    isLoading={!isUserFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <TextField
                          {...register("postalCode")}
                          label="Código Postal"
                          error={!!errors.postalCode}
                          helperText={errors.postalCode?.message}
                          autoComplete="off"
                          InputLabelProps={{ shrink: getValues("postalCode")?.length > 0 }}
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
                render={({ field }) => (
                  <RichEditor
                    value={field.value}
                    onChange={field.onChange}
                    isLoading={!isUserFinished}
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
              disabled={!isUserFinished || !isUserPersonalDataFinished || isFormUnchanged()}
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
