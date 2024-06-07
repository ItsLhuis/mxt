import React, { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { useUser } from "@/contexts/user"

import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getUserAvatar } from "@api/routes/user"
import { logout } from "@api/routes/auth"

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

  const navigate = useNavigate()

  const { user, deleteUser } = useUser()

  const { mutateAsync: logoutMutate, isPending } = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return logout().then(() => deleteUser())
    }
  })

  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    const fetchAvatar = async () => {
      getUserAvatar(user.id, { size: 120 }).then((url) => setAvatar(url))
    }

    fetchAvatar()
  }, [user.id])

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
            <ImagePicker image={avatar} setImage={setAvatar} alt={user.username} />
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
              loading={isPending}
              variant="contained"
              color="error"
              onClick={async () => {
                await logoutMutate().then(() => navigate("/auth/login"))
              }}
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
                      <LoadingButton loading={isPending} type="submit" variant="contained">
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
