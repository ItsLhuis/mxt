import React from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Stack,
  FormControl,
  TextField,
  Switch,
  Typography,
  Tooltip,
  IconButton,
  InputAdornment
} from "@mui/material"
import { AccountBox, Refresh } from "@mui/icons-material"

import { HeaderSection, Select } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

import { generateRandomPassword } from "@utils/generateRandomPassword"

const AddEmployeeForm = () => {
  const navigate = useNavigate()

  const { role } = useAuth()

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: "",
      isActive: true
    }
  })

  const isFormUnchanged = () => {
    return !isDirty
  }

  const handleGeneratePassword = () => {
    const randomPassword = generateRandomPassword()
    setValue("password", randomPassword, { shouldDirty: true })
  }

  const { createNewUser } = useUser()

  const onSubmit = async (data) => {
    if (isFormUnchanged() || createNewUser.isPending) return

    await createNewUser
      .mutateAsync(data)
      .then(() => {
        navigate("/employee/list")
        showSuccessToast("Funcionário adicionado com sucesso!")
      })
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
          showErrorToast("Erro ao adicionar funcionário!")
        }
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ marginTop: 3, gap: 3 }}>
        <Paper elevation={1}>
          <HeaderSection
            title="Detalhes"
            description="Nome de utilizador, email, senha,... do funcionário"
            icon={<AccountBox />}
          />
          <Stack sx={{ padding: 3, gap: 2 }}>
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
                    disabled={createNewUser.isPending}
                  />
                )}
              />
            </FormControl>
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
                    disabled={createNewUser.isPending}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Senha"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="off"
                    disabled={createNewUser.isPending}
                    InputLabelProps={{ shrink: watch("password")?.length > 0 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Gerar senha">
                            <IconButton edge="end" onClick={handleGeneratePassword}>
                              <Refresh />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </FormControl>
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
                    disabled={createNewUser.isPending}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  {...register("isActive")}
                  defaultChecked
                  disabled={createNewUser.isPending}
                />
                <Stack>
                  <Typography variant="p" component="p">
                    Estado da conta
                  </Typography>
                  <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                    {watch("isActive") ? "Ativa" : "Inativa"}
                  </Typography>
                </Stack>
              </Stack>
            </FormControl>
            <Box sx={{ marginLeft: "auto", marginTop: 1 }}>
              <LoadingButton
                loading={createNewUser.isPending}
                type="submit"
                variant="contained"
                disabled={isFormUnchanged() || createNewUser.isPending}
              >
                Adicionar Funcionário
              </LoadingButton>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </form>
  )
}

export default AddEmployeeForm
