import React from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { initialCompanySchema } from "@schemas/company"

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
  useTheme,
  useMediaQuery
} from "@mui/material"

import { HeaderSection, ImagePicker } from "@components/ui"
import { showErrorToast } from "@/config/toast"

const Company = () => {
  const navigate = useNavigate()

  const { reloadAuthStatus } = useAuth()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(initialCompanySchema)
  })

  const { updateCompany } = useCompany()

  const onSubmit = async (data) => {
    await updateCompany
      .mutateAsync(data)
      .then(() => {
        reloadAuthStatus()
        navigate("/dashboard")
      })
      .catch(() => showErrorToast("Erro ao atualizar empresa!"))
  }

  return (
    <Stack
      component="main"
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        overflowY: "auto"
      }}
    >
      <Box sx={{ margin: "auto" }}>
        <Paper sx={{ maxWidth: 900, margin: 3 }} elevation={1}>
          <HeaderSection
            title="Para continuar, precisa de atualizar os dados sobre a empresa"
            description="Posteriormente, poderá alterar estes dados"
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Grid container spacing={2} sx={{ paddingInline: 3 }}>
                <Grid item xs={12}>
                  <Stack
                    sx={{
                      alignItems: "center",
                      flexDirection: isSmallScreen ? "column" : "row",
                      gap: 2
                    }}
                  >
                    <Box sx={{ width: !isSmallScreen ? "35%" : "100%" }}>
                      <Controller
                        name="logo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <ImagePicker
                            withLoadingEffect={false}
                            circular={false}
                            size={110}
                            image={field.value}
                            onChange={field.onChange}
                            error={!!errors.logo}
                            errorMessage={errors.logo?.message}
                            sx={{ "& img": { objectFit: "contain !important" } }}
                          />
                        )}
                      />
                    </Box>
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
                <LoadingButton loading={updateCompany.isPending} type="submit" variant="contained">
                  Atualizar Empresa
                </LoadingButton>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Stack>
  )
}

export default Company
