import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserStatusSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, FormControl, Switch, Skeleton, Paper } from "@mui/material"
import { VerifiedUser } from "@mui/icons-material"

import { Loadable, HeaderSection } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EmployeeStatusForm = ({ user, isUserFinished }) => {
  const { control, handleSubmit, watch, reset } = useForm({
    resolver: zodResolver(updateUserStatusSchema)
  })

  const initialValues = {
    isActive: isUserFinished ? Boolean(user?.user.is_active) : true
  }

  const isFormUnchanged = () => {
    const values = watch()
    return values.isActive === Boolean(user?.user.is_active)
  }

  useEffect(() => {
    if (isUserFinished && user) {
      reset(initialValues)
    }
  }, [isUserFinished, user])

  const { updateUserStatus } = useUser()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      updateUserStatus
        .mutateAsync({
          userId: user?.user?.id,
          ...data
        })
        .then(() => showSuccessToast("Estado da conta atualizado com sucesso!"))
        .catch(() => showErrorToast("Erro ao atualizar estado da conta!"))
    }
  }

  return (
    <Paper elevation={1}>
      <Stack>
        <HeaderSection
          title="Estado"
          description="Atualizar estado da conta do funcionário"
          icon={<VerifiedUser />}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 3
            }}
          >
            <Loadable
              isLoading={!isUserFinished}
              LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
              LoadedComponent={
                <FormControl fullWidth>
                  <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          edge="start"
                          value={field.value}
                          onChange={field.onChange}
                          defaultChecked={Boolean(user?.user.is_active)}
                        />
                      )}
                    />
                    <Stack>
                      <Typography variant="p" component="p">
                        Estado da conta
                      </Typography>
                      <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                        {watch("isActive") ? "Conta ativa" : "Conta inativa"}
                      </Typography>
                    </Stack>
                  </Stack>
                </FormControl>
              }
            />
            <Box>
              <LoadingButton
                loading={updateUserStatus.isPending}
                type="submit"
                variant="contained"
                disabled={!isUserFinished || isFormUnchanged()}
              >
                Atualizar Estado
              </LoadingButton>
            </Box>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}

export default EmployeeStatusForm
