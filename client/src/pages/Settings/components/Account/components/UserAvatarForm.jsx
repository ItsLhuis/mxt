import React, { useEffect, useState } from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserAvatarSchema } from "@schemas/user"

import { BASE_URL } from "@api"
import { useUser } from "@/hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import { Box } from "@mui/material"

import { HeaderSection, ImagePicker } from "@components/ui"

import { showErrorToast, showSuccessToast } from "@/config/toast"

const UserAvatarForm = ({ user, isLoading, isError }) => {
  const isUserFinished = !isLoading && !isError

  const [avatarChanged, setAvatarChanged] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(updateUserAvatarSchema),
    defaultValues: {
      avatar: isUserFinished ? `${BASE_URL}/users/${user.id}/avatar?size=200` : ""
    }
  })

  useEffect(() => {
    if (isUserFinished && user) {
      reset({ avatar: `${BASE_URL}/users/${user.id}/avatar?size=200` })
    }
  }, [isUserFinished])

  const { updateUserProfileAvatar } = useUser()

  const onSubmit = async (data) => {
    if (!isUserFinished || !avatarChanged) return

    updateUserProfileAvatar
      .mutateAsync(data)
      .then(() => {
        setAvatarChanged(false)
        showSuccessToast("Avatar atualizado com sucesso!")
      })
      .catch(() => showErrorToast("Erro ao atualizar avatar!"))
  }

  return (
    <>
      <HeaderSection title="Avatar" description="Atualizar avatar do utilizador" />
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
              name="avatar"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ImagePicker
                  size={100}
                  image={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    if (value !== `${BASE_URL}/users/${user?.id}/avatar?size=200`) {
                      setAvatarChanged(true)
                    }
                  }}
                  alt={isUserFinished ? user.username : ""}
                  name={isUserFinished ? user.username : ""}
                  loading={!isUserFinished}
                  error={!!errors.logo}
                  errorMessage={errors.logo?.message}
                />
              )}
            />
            <Box sx={{ marginLeft: "auto" }}>
              <LoadingButton
                loading={updateUserProfileAvatar.isPending}
                type="submit"
                variant="contained"
                disabled={!isUserFinished || !avatarChanged}
              >
                Atualizar Avatar
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  )
}

export default UserAvatarForm
