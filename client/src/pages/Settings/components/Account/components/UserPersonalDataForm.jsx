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

import { showErrorToast, showSuccessToast } from "@config/toast"

import { sanitizeHTML } from "@utils/sanitizeHTML"

const UserPersonalDataForm = ({ user, isLoading, isError }) => {
  const isUserFinished = !isLoading && !isError

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(updateUserPersonalDataSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      country: "",
      city: "",
      locality: "",
      address: "",
      postalCode: "",
      description: ""
    }
  })

  const { updateUserPersonalData, findEmployeeByUserId } = useUser()
  const {
    data: userPersonalData,
    isLoading: isUserPersonalDataLoading,
    isError: isUserPersonalDataError
  } = findEmployeeByUserId(user.id)

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

  const isFormUnchanged = () => {
    const values = watch()
    return (
      values.name === initialValues.name &&
      values.phoneNumber === initialValues.phoneNumber &&
      values.country === initialValues.country &&
      values.city === initialValues.city &&
      values.locality === initialValues.locality &&
      values.address === initialValues.address &&
      values.postalCode === initialValues.postalCode &&
      (sanitizeHTML(values.description) === "" ? "" : values.description) ===
        initialValues.description
    )
  }

  useEffect(() => {
    if (isUserFinished && isUserPersonalDataFinished && user) {
      reset(initialValues)
    }
  }, [isUserFinished, isUserPersonalDataFinished, user])

  const onSubmit = async (data) => {
    if (!isUserFinished || !isUserPersonalDataFinished || isFormUnchanged()) return

    await updateUserPersonalData
      .mutateAsync({
        userId: user.id,
        ...data,
        description: sanitizeHTML(data.description) === "" ? null : data.description
      })
      .then(() => showSuccessToast("Dados pessoais atualizados com sucesso!"))
      .catch(() => showErrorToast("Erro ao atualizar dados pessoais!"))
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
                      InputLabelProps={{ shrink: watch("name")?.length > 0 }}
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
                          defaultCountry={"pt"}
                          label="Contacto"
                          variant="outlined"
                          fullWidth
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber?.message}
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
                      InputLabelProps={{ shrink: watch("country")?.length > 0 }}
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
                      InputLabelProps={{ shrink: watch("city")?.length > 0 }}
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
                      InputLabelProps={{ shrink: watch("locality")?.length > 0 }}
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
                          InputLabelProps={{ shrink: watch("address")?.length > 0 }}
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
                          InputLabelProps={{ shrink: watch("postalCode")?.length > 0 }}
                        />
                      </FormControl>
                    }
                  />
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
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
                }
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
