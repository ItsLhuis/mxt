import React, { useEffect } from "react"

import { useForm, useFormState, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema } from "@schemas/company"

import { useCompany } from "@hooks/server/useCompany"

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

import { HeaderSection, Loadable } from "@components/ui"

import { showErrorToast, showSuccessToast } from "@config/toast"

const CompanyDataForm = ({ company, isLoading, isError }) => {
  const isCompanyFinished = !isLoading && !isError

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(companySchema)
  })

  const initialValues = {
    name: company?.name || "",
    email: company?.email || "",
    phoneNumber: company?.phone_number || "+351",
    website: company?.website || "",
    city: company?.city || "",
    country: company?.country || "",
    locality: company?.locality || "",
    address: company?.address || "",
    postalCode: company?.postal_code || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (isCompanyFinished && company) {
      reset(initialValues)
    }
  }, [isCompanyFinished, company])

  const { updateCompany } = useCompany()

  const onSubmit = async (data) => {
    if (!isCompanyFinished || isFormUnchanged()) return

    await updateCompany
      .mutateAsync(data)
      .then(() => showSuccessToast("Empresa atualizada com sucesso!"))
      .catch(() => showErrorToast("Erro ao atualizar empresa!"))
  }

  return (
    <>
      <HeaderSection title="Dados" description="Atualizar dados da empresa" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ paddingTop: 1 }}>
          <Grid container spacing={2} sx={{ paddingInline: 3 }}>
            <Grid item xs={12}>
              <Stack
                sx={{
                  alignItems: "center",
                  flexDirection: isSmallScreen ? "column" : "row",
                  gap: 2
                }}
              >
                <Stack sx={{ flexDirection: "column", gap: 2, width: "100%" }}>
                  <Loadable
                    isLoading={!isCompanyFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <TextField
                          {...register("name")}
                          label="Nome"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          autoComplete="off"
                        />
                      </FormControl>
                    }
                  />
                  <Loadable
                    isLoading={!isCompanyFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <TextField
                          {...register("email")}
                          label="E-mail"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          autoComplete="off"
                        />
                      </FormControl>
                    }
                  />
                  <Loadable
                    isLoading={!isCompanyFinished}
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
                              disableDropdown
                            />
                          )}
                        />
                      </FormControl>
                    }
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isCompanyFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField {...register("website")} label="Site" autoComplete="off" />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isCompanyFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("country")}
                      label="País"
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      autoComplete="off"
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isCompanyFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("city")}
                      label="Cidade"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      autoComplete="off"
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isCompanyFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <TextField
                      {...register("locality")}
                      label="Localidade"
                      error={!!errors.locality}
                      helperText={errors.locality?.message}
                      autoComplete="off"
                    />
                  </FormControl>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Stack sx={{ flexDirection: isSmallScreen ? "column" : "row", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <Loadable
                    isLoading={!isCompanyFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <TextField
                          {...register("address")}
                          label="Morada"
                          error={!!errors.address}
                          helperText={errors.address?.message}
                          autoComplete="off"
                        />
                      </FormControl>
                    }
                  />
                </Box>
                <Box sx={{ width: !isSmallScreen ? "60%" : "100%" }}>
                  <Loadable
                    isLoading={!isCompanyFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <TextField
                          {...register("postalCode")}
                          label="Código Postal"
                          error={!!errors.postalCode}
                          helperText={errors.postalCode?.message}
                          autoComplete="off"
                        />
                      </FormControl>
                    }
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ marginLeft: "auto", padding: 3 }}>
            <LoadingButton
              loading={updateCompany.isPending}
              type="submit"
              variant="contained"
              sx={{ marginLeft: "auto" }}
              disabled={!isCompanyFinished || isFormUnchanged()}
            >
              Atualizar Empresa
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </>
  )
}

export default CompanyDataForm
