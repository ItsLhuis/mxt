import React, { useEffect } from "react"

import { useAuth } from "@contexts/auth"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserRoleSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import { Stack, Box, Typography, FormControl, Skeleton } from "@mui/material"

import { Loadable, HeaderSection, Select } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const EmployeeRoleForm = ({ user, isUserFinished }) => {
  const { role } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    resolver: zodResolver(updateUserRoleSchema)
  })

  const initialValues = {
    role: user?.user.role || ""
  }

  const isFormUnchanged = () => {
    const values = watch()
    return values.role === user?.user.role
  }

  useEffect(() => {
    if (isUserFinished && user) {
      reset(initialValues)
    }
  }, [isUserFinished, user])

  const { updateUserRole } = useUser()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      updateUserRole
        .mutateAsync({
          userId: user?.user?.id,
          ...data
        })
        .then(() => showSuccessToast("Cargo atualizado com sucesso!"))
        .catch(() => showErrorToast("Erro ao atualizar cargo!"))
    }
  }

  return (
    <Stack sx={{ paddingBottom: 2 }}>
      <HeaderSection title="Cargo" description="Alterar cargo do funcionário" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: 1
          }}
        >
          <Box sx={{ width: "100%", marginInline: 3 }}>
            <Loadable
              isLoading={!isUserFinished}
              LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
              LoadedComponent={
                <FormControl fullWidth>
                  <Controller
                    name="role"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        ref={field.ref}
                        label="Cargo"
                        data={[
                          "",
                          ...(role !== "Administrador" ? ["Administrador"] : []),
                          "Funcionário"
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        error={!!errors.role}
                        helperText={errors.role?.message}
                      />
                    )}
                  />
                </FormControl>
              }
            />
          </Box>
          <Box sx={{ paddingRight: 3 }}>
            <LoadingButton
              loading={updateUserRole.isPending}
              type="submit"
              variant="contained"
              disabled={!isUserFinished || isFormUnchanged()}
            >
              Atualizar Cargo
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}

export default EmployeeRoleForm
