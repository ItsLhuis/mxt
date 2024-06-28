import React from "react"

import { useUser } from "@hooks/server/useUser"

import { Paper, Divider } from "@mui/material"
import { Person } from "@mui/icons-material"

import { HeaderSection } from "@components/ui"
import { UserAvatarForm, UserAccountDataForm, UserPersonalDataForm, UserLogout } from "./components"

const Account = () => {
  const { findUserProfile } = useUser()
  const { data: user, isLoading: isUserLoading, isError: isUserError } = findUserProfile

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Conta"
        description="Dados relacionados com o utilizador"
        icon={<Person />}
      />
      <UserAvatarForm user={user} isLoading={isUserLoading} isError={isUserError} />
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <UserAccountDataForm user={user} isLoading={isUserLoading} isError={isUserError} />
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <UserPersonalDataForm user={user} isLoading={isUserLoading} isError={isUserError} />
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <UserLogout isLoading={isUserLoading} isError={isUserError} />
    </Paper>
  )
}

export default Account
