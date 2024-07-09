import React, { useEffect } from "react"

import { useAuth } from "@contexts/auth"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserRoleSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import { Stack, Box, FormControl, Skeleton, Paper } from "@mui/material"
import { ManageAccounts } from "@mui/icons-material"

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
    <Paper elevation={1}>
      <Stack>
        <HeaderSection
          title="Cargo"
          description="Atualizar cargo do funcionário"
          icon={<ManageAccounts />}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ padding: 3 }}>
            <Box sx={{ minWidth: 90 }}>
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
            <Box sx={{ marginLeft: "auto", marginTop: 3 }}>
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
    </Paper>
  )
}

export default EmployeeRoleForm
