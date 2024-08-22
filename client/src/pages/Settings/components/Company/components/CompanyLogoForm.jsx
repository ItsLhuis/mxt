import React, { useState } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companyLogoSchema } from "@schemas/company"

import { BASE_URL } from "@api"
import { useCompany } from "@hooks/server/useCompany"

import { LoadingButton } from "@mui/lab"
import { Box } from "@mui/material"

import { HeaderSection, ImagePicker } from "@components/ui"

import { showErrorToast, showSuccessToast } from "@config/toast"

const CompanyLogoForm = ({ isLoading, isError }) => {
  const isCompanyFinished = !isLoading && !isError

  const [logoChanged, setLogoChanged] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(companyLogoSchema),
    defaultValues: {
      logo: `${BASE_URL}/company/logo?size=180`
    }
  })

  const { updateCompanyLogo } = useCompany()

  const onSubmit = async (data) => {
    if (!isCompanyFinished || !logoChanged) return

    updateCompanyLogo
      .mutateAsync(data)
      .then(() => {
        setLogoChanged(false)
        showSuccessToast("Logotipo atualizado com sucesso!")
      })
      .catch(() => showErrorToast("Erro ao atualizar logotipo!"))
  }

  return (
    <>
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
            <Controller
              name="logo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ImagePicker
                  circular={false}
                  size={100}
                  image={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    if (value !== `${BASE_URL}/company/logo?size=180`) {
                      setLogoChanged(true)
                    }
                  }}
                  loading={!isCompanyFinished}
                  error={!!errors.logo}
                  helperText={errors.logo?.message}
                  sx={{ "& img": { objectFit: "contain !important" } }}
                />
              )}
            />
            <Box sx={{ marginLeft: "auto" }}>
              <LoadingButton
                loading={updateCompanyLogo.isPending}
                type="submit"
                variant="contained"
                disabled={!isCompanyFinished || !logoChanged}
              >
                Atualizar Logotipo
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  )
}

export default CompanyLogoForm
