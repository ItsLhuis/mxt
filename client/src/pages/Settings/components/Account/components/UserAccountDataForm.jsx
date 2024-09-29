import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserAccountSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import { Grid, Box, Stack, FormControl, TextField, Skeleton } from "@mui/material"

import { HeaderSection, Loadable } from "@components/ui"

import { showErrorToast, showSuccessToast } from "@config/toast"

const UserAccountDataForm = ({ user, isLoading, isError }) => {
  const isUserFinished = !isLoading && !isError && user

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(updateUserAccountSchema)
  })

  const initialValues = {
    username: user?.username || "",
    email: user?.email || ""
  }

  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (isUserFinished) {
      reset(initialValues)
    }
  }, [isUserFinished])

  const { updateUserProfile } = useUser()

  const onSubmit = async (data) => {
    if (!isUserFinished || isFormUnchanged() || updateUserProfile.isPending) return

    await updateUserProfile
      .mutateAsync(data)
      .then(() => showSuccessToast("Conta atualizada com sucesso!"))
      .catch((error) => {
        if (error.error.code === "USR-001") {
          setError("username", {
            type: "manual",
            message: "Nome de utilizador já existente"
          })
        } else if (error.error.code === "USR-002") {
          setError("email", {
            type: "manual",
            message: "E-mail já existente"
          })
        } else {
          showErrorToast("Erro ao atualizar conta!")
        }
      })
  }

  return (
    <>
      <HeaderSection title="Conta" description="Atualizar dados da conta do utilizador" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ paddingTop: 1 }}>
          <Grid container spacing={2} sx={{ paddingInline: 3 }}>
            <Grid item xs={12}>
              <Loadable
                isLoading={!isUserFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="username"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nome de utilizador"
                          error={!!errors.username}
                          helperText={errors.username?.message}
                          autoComplete="off"
                          disabled={updateUserProfile.isPending}
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
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="E-mail"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          autoComplete="off"
                          disabled={updateUserProfile.isPending}
                        />
                      )}
                    />
                  </FormControl>
                }
              />
            </Grid>
          </Grid>
          <Box sx={{ marginLeft: "auto", padding: 3 }}>
            <LoadingButton
              loading={updateUserProfile.isPending}
              type="submit"
              variant="contained"
              sx={{ marginLeft: "auto" }}
              disabled={!isUserFinished || isFormUnchanged() || updateUserProfile.isPending}
            >
              Atualizar Conta
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </>
  )
}

export default UserAccountDataForm
