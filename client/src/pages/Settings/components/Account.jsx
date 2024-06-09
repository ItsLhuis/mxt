import React, { useEffect, useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { BASE_URL } from "@api"
import { useAuth } from "@hooks/server/useAuth"
import { useUser } from "@hooks/server/useUser"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Stack,
  ListItemText
} from "@mui/material"

import { ImagePicker } from "@components/ui"

import { showSuccessToast } from "@config/toast"

import { formatPhoneNumber } from "@utils/format/phone"

const schema = z.object({
  username: z.string().trim().min(1, { message: "O nome de utilizador é obrigatório" }),
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "O e-mail é obrigatório" })
    .email({ message: "O e-mail é inválido" }),
  phone: z.string().trim().min(1, { message: "O telefone é obrigatório" }),
  country: z.string().trim().min(1, { message: "O país é obrigatório" }),
  address: z.string().trim().min(1, { message: "A morada é obrigatória" })
})

const Account = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(schema)
  })

  const { logout } = useAuth()

  const { userProfile } = useUser()
  const { data: user, isLoading: isUserLoading } = userProfile

  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    if (!isUserLoading) {
      setAvatar(`${BASE_URL}/users/${user.id}/avatar?size=240`)
    }
  }, [isUserLoading])

  const onSubmit = (data) => {
    const newData = { ...data, image: image }

    setLoad(true)
    setTimeout(() => {
      console.log(newData)
      if (Object.keys(errors).length === 0) {
        showSuccessToast("Salvo com sucesso!")
      }
      setLoad(false)
    }, 1000)
  }

  return (
    <Grid container columnSpacing={3}>
      <Grid item xs={12} md={12} lg={4}>
        <Paper elevation={1}>
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 2,
              padding: 6
            }}
          >
            <ImagePicker
              image={avatar}
              setImage={setAvatar}
              alt={isUserLoading ? "Avatar de utilizador" : user.username}
              name={!isUserLoading ? user.username : ""}
            />
            <ListItemText
              sx={{
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <Typography
                variant="h4"
                component="h4"
                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {user.username}
              </Typography>
              <Typography
                variant="p"
                component="p"
                sx={{
                  color: "var(--outline)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: 0.5
                }}
              >
                {user.role}
              </Typography>
            </ListItemText>
            <LoadingButton
              loading={logout.isPending}
              variant="contained"
              color="error"
              onClick={() => logout.mutate()}
            >
              Terminar Sessão
            </LoadingButton>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <Paper elevation={1} sx={{ marginTop: { xs: 3, md: 3, lg: 0 } }}>
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" component="h5" sx={{ marginBottom: 1 }}>
              Conta
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        {...register("username")}
                        label="Nome de utilizador"
                        error={!!errors.username}
                        helperText={errors.username?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        {...register("name")}
                        label="Nome"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        {...register("email")}
                        label="E-mail"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        {...register("phone")}
                        label="Telemóvel"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        {...register("country")}
                        label="País"
                        error={!!errors.country}
                        helperText={errors.country?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        {...register("address")}
                        label="Morada"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={3} sx={{ alignItems: "flex-end" }}>
                      <FormControl fullWidth>
                        <TextField {...register("about")} label="Sobre" multiline rows={5} />
                      </FormControl>
                      <LoadingButton loading={logout.isPending} type="submit" variant="contained">
                        Salvar Alterações
                      </LoadingButton>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Account
