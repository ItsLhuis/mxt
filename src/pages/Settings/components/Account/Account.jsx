import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useLoader } from "@contexts/loaderContext"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Stack,
  Button,
  ListItemText
} from "@mui/material"

import { ImagePicker } from "@components/ui"

import toast from "react-hot-toast"

const Account = () => {
  const navigate = useNavigate()

  const { showLoader, hideLoader } = useLoader()

  const [load, setLoad] = useState(false)
  const [image, setImage] = useState("")
  const [formData, setFormData] = useState({
    image: image,
    username: "Luis Rodrigues",
    name: "Luis Rodrigues",
    email: "luisrodrigues@gmail.com",
    phone: "921 034 943",
    country: "Portugal",
    address: "Rua Joaquim António de Aguiar 168 4049-005 Porto",
    about:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu enim finibus, pretium mauris eu, finibus lorem. In tincidunt leo nisl, quis vehicula mauris vestibulum scelerisque. Nunc tempor placerat libero a efficitur. Nam aliquam, ipsum ut scelerisque aliquam, nunc tellus ultricies sem, a vulputate mi sem quis sapien. Nullam a justo mattis, feugiat tortor at, accumsan nisi. In mollis, dolor eu aliquam auctor, orci sem interdum eros, et gravida libero purus vitae nibh. Mauris vestibulum posuere neque non pulvinar. Duis varius orci nunc, ut imperdiet urna vestibulum consectetur. Ut at fermentum arcu. Aenean in urna a diam scelerisque finibus vel at quam. Sed ut volutpat purus, vitae suscipit magna. Donec in orci scelerisque, sodales massa eget, lobortis magna. In nibh mauris, venenatis eget lacinia quis, auctor quis augue."
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const notify = () => toast.success("Salvo com sucesso!")

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoad(true)

    setTimeout(() => {
      const newErrors = {}

      if (!formData.username) {
        newErrors.username = "O nome de utilizador é obrigatório"
      }
      if (!formData.name) {
        newErrors.name = "O nome é obrigatório"
      }
      if (!formData.email) {
        newErrors.email = "O e-mail é obrigatório"
      }
      if (!formData.phone) {
        newErrors.phone = "O telefone é obrigatório"
      }
      if (!formData.country) {
        newErrors.name = "O país é obrigatório"
      }
      if (!formData.address) {
        newErrors.address = "A morada é obrigatória"
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        notify()
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
            <ImagePicker image={image} setImage={setImage} alt="Luis Rodrigues" />
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
                Luis Rodrigues
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
                Administrador
              </Typography>
            </ListItemText>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                showLoader()

                setTimeout(() => {
                  navigate("/auth")

                  hideLoader()
                }, 1000)
              }}
            >
              Terminar Sessão
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <Paper elevation={1} sx={{ marginTop: { xs: 3, md: 3, lg: 0 } }}>
          <Box sx={{ padding: 3 }}>
            <Typography variant="h4" component="h4" sx={{ marginBottom: 1 }}>
              Conta
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        label="Nome de utilizador"
                        error={!!errors.username}
                        helperText={errors.username}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        label="Nome"
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        label="E-mail"
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        label="Telemóvel"
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        label="País"
                        error={!!errors.country}
                        helperText={errors.country}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        label="Morada"
                        error={!!errors.address}
                        helperText={errors.address}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={3} sx={{ alignItems: "flex-end" }}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          name="about"
                          value={formData.about}
                          onChange={handleChange}
                          label="Sobre"
                          multiline
                          rows={5}
                        />
                      </FormControl>
                      <LoadingButton loading={load} type="submit" variant="contained">
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
