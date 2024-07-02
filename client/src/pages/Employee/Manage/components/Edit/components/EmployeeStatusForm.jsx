import React, { useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserStatusSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, FormControl, Switch, Skeleton } from "@mui/material"

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
    <Stack sx={{ paddingBottom: 2 }}>
      <HeaderSection title="Estado" description="Alterar estado da conta do funcionário" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: 1
          }}
        >
          <Loadable
            isLoading={!isUserFinished}
            LoadingComponent={
              <Skeleton variant="rounded" width="100%" sx={{ marginInline: 3 }} height={52} />
            }
            LoadedComponent={
              <FormControl fullWidth>
                <Stack sx={{ flexDirection: "row", alignItems: "center", paddingInline: 2 }}>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
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
          <Box sx={{ paddingRight: 3 }}>
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
  )
}

export default EmployeeStatusForm
