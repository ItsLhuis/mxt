import React, { useState } from "react"

import { LoadingButton } from "@mui/lab"
import { Paper, Box, Typography, Grid, TextField, FormControl, Stack } from "@mui/material"

import toast from "react-hot-toast"

const Account = () => {
  const [load, setLoad] = useState(false)

  const [formData, setFormData] = useState({
    nome: "Luis Rodrigues",
    email: "luisrodrigues@gmail.com",
    telefone: "921 034 943",
    morada: "Rua Joaquim António de Aguiar 168 4049-005 Porto",
    sobre:
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

      if (!formData.nome) {
        newErrors.nome = "O nome é obrigatório"
      }
      if (!formData.email) {
        newErrors.email = "O e-mail é obrigatório"
      }
      if (!formData.telefone) {
        newErrors.telefone = "O telefone é obrigatório"
      }
      if (!formData.morada) {
        newErrors.morada = "A morada é obrigatória"
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        notify()
      }

      setLoad(false)
    }, 1000)
  }

  return (
    <Paper elevation={1}>
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
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    label="Nome"
                    error={!!errors.nome}
                    helperText={errors.nome}
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
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    label="Telemóvel"
                    error={!!errors.telefone}
                    helperText={errors.telefone}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    name="morada"
                    value={formData.morada}
                    onChange={handleChange}
                    label="Morada"
                    error={!!errors.morada}
                    helperText={errors.morada}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={3} sx={{ alignItems: "flex-end" }}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      name="sobre"
                      value={formData.sobre}
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
  )
}

export default Account
