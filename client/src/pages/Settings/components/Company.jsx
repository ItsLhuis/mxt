import React, { useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { useLoader } from "@contexts/loader"

import { useAuth } from "@contexts/auth"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema } from "@schemas/company"

import { BASE_URL } from "@api"
import { useCompany } from "@hooks/server/useCompany"

import { MuiTelInput } from "mui-tel-input"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Grid,
  Box,
  Stack,
  FormControl,
  TextField,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Business } from "@mui/icons-material"

import { HeaderSection, ImagePicker } from "@components/ui"

const Company = () => {
  const navigate = useNavigate()

  const { showLoader, hideLoader } = useLoader()

  const { reloadAuthStatus } = useAuth()

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

  const { findCompany, updateCompany } = useCompany()
  const { data: company, isLoading: isCompanyLoading, isError: isCompanyError } = findCompany

  const isCompanyFinished = !isCompanyLoading && !isCompanyError

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

  const logo = `${BASE_URL}/company/logo?size=160`

  useEffect(() => {
    if (isCompanyFinished && company) {
      hideLoader()
      reset(initialValues)
    } else {
      showLoader()
    }
  }, [isCompanyFinished, company])

  const onSubmit = async (data) => {
    if (!(data.logo instanceof File)) {
      delete data.logo
    }

    await updateCompany
      .mutateAsync(data)
      .then(() => {
        reloadAuthStatus()
        navigate("/dashboard")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  if (!isCompanyFinished) {
    return null
  }

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Empresa"
        description="Dados relacionados com a empresa"
        icon={<Business />}
      />
      <HeaderSection title="Logotipo" description="Atualizar logotipo da empresa" />
      <Box sx={{ padding: 3, paddingLeft: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 2
            }}
          >
            <Box
              sx={{
                marginRight: "auto"
              }}
            >
              <Controller
                name="logo"
                control={control}
                defaultValue={logo}
                render={({ field }) => (
                  <ImagePicker
                    circular={false}
                    size={90}
                    image={
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value
                        ? `${BASE_URL}/company/logo?size=160`
                        : ""
                    }
                    onChange={field.onChange}
                    error={!!errors.logo}
                    sx={{ "& img": { objectFit: "contain !important" } }}
                  />
                )}
              />
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              <LoadingButton loading={updateCompany.isPending} type="submit" variant="contained">
                Atualizar Logotipo
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </Box>
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
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
                  <FormControl fullWidth>
                    <TextField
                      {...register("name")}
                      label="Nome"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      {...register("email")}
                      label="E-mail"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      defaultValue="+351"
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
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField {...register("website")} label="Site" />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  {...register("country")}
                  label="País"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  {...register("city")}
                  label="Cidade"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  {...register("locality")}
                  label="Localidade"
                  error={!!errors.locality}
                  helperText={errors.locality?.message}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack sx={{ flexDirection: isSmallScreen ? "column" : "row", gap: 2 }}>
                <FormControl fullWidth>
                  <TextField
                    {...register("address")}
                    label="Morada"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </FormControl>
                <FormControl sx={{ width: !isSmallScreen ? "60%" : "100%" }}>
                  <TextField
                    {...register("postalCode")}
                    label="Código Postal"
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                  />
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ marginLeft: "auto", padding: 3 }}>
            <LoadingButton
              loading={updateCompany.isPending}
              type="submit"
              variant="contained"
              sx={{ marginLeft: "auto" }}
            >
              Atualizar Empresa
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Paper>
  )
}

export default Company
