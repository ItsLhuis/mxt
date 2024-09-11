import React, { useState, useEffect, useRef } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserPasswordSchema } from "@schemas/user"

import { useUser } from "@hooks/server/useUser"

import { Paper, Box, Button, FormControl, TextField, Stack } from "@mui/material"
import SecurityIcon from "@mui/icons-material/Security"

import { HeaderSection, Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const Security = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(updateUserPasswordSchema)
  })

  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const currentPasswordRef = useRef(null)

  useEffect(() => {
    if (!changePasswordModal) {
      reset()
      return
    }

    const timer = setTimeout(() => {
      if (changePasswordModal && currentPasswordRef.current) {
        currentPasswordRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [changePasswordModal])

  const { findUserProfile, updateUserPassword } = useUser()

  const isUserFinished = !findUserProfile.isLoading && !findUserProfile.isError

  const onSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      if (isUserFinished) {
        updateUserPassword
          .mutateAsync({ userId: findUserProfile?.data?.id, ...data })
          .then(() => {
            setChangePasswordModal(false)
            showSuccessToast("Senha alterada com sucesso!")
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "USR-005") {
              setError("password", {
                type: "manual",
                message: "Senha atual incorreta"
              })
              reject()
              return
            }
            setChangePasswordModal(false)
            showErrorToast("Erro ao alterar senha!")
            reject()
          })
      } else {
        setChangePasswordModal(false)
        showErrorToast("Erro ao alterar senha!")
        reject()
      }
    })
  }

  return (
    <>
      <Paper elevation={1}>
        <HeaderSection
          title="Segurança"
          description="Definições de Segurança"
          icon={<SecurityIcon />}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 2,
            paddingBottom: 2,
            paddingRight: 3
          }}
        >
          <HeaderSection title="Senha" description="Altere a sua senha" />
          <Box sx={{ paddingTop: 2 }}>
            <Button
              variant="contained"
              color="error"
              disabled={!isUserFinished}
              onClick={() => setChangePasswordModal(true)}
            >
              Alterar Senha
            </Button>
          </Box>
        </Box>
      </Paper>
      <Modal
        open={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        mode="form"
        title="Alterar Senha"
        submitButtonText="Alterar Senha"
        color="error"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack sx={{ padding: 3, gap: 2 }}>
          <FormControl fullWidth>
            <TextField
              inputRef={currentPasswordRef}
              {...register("password")}
              type="password"
              label="Senha atual"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              {...register("newPassword")}
              type="password"
              label="Nova senha"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              autoComplete="new-password"
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              {...register("confirmPassword")}
              type="password"
              label="Confirmar nova senha"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
          </FormControl>
        </Stack>
      </Modal>
    </>
  )
}

export default Security
