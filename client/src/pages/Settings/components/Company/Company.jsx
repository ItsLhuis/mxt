import React from "react"

import { useCompany } from "@hooks/server/useCompany"

import { Paper, Divider } from "@mui/material"
import { Business } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"
import { CompanyLogoForm, CompanyDataForm } from "./components"

const Company = () => {
  const { findCompany } = useCompany()
  const { data: company, isLoading: isCompanyLoading, isError: isCompanyError } = findCompany

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Empresa"
        description="Dados relacionados com a empresa"
        icon={<Business />}
      />
      <CompanyLogoForm isLoading={isCompanyLoading} isError={isCompanyError} />
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <CompanyDataForm company={company} isLoading={isCompanyLoading} isError={isCompanyError} />
    </Paper>
  )
}

export default Company
