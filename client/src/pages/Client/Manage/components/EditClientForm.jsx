import React from "react"

const EditClientForm = () => {
  return (
    <>
      <Paper elevation={1}>
        <Box>
          <HeaderSection title="Contacto" description="Tipo de contacto e o contacto do cliente" />
          <Stack sx={{ padding: 3, gap: 3 }}>
            <FormControl fullWidth>
              <Controller
                name="contactType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    ref={field.ref}
                    label="Tipo"
                    data={["", "E-mail", "Telefone", "Telemóvel", "Outro"]}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.contactType}
                    helperText={errors.contactType?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                {...register("contact")}
                label="Contacto"
                error={!!errors.contact}
                helperText={errors.contact?.message}
              />
            </FormControl>
            <Controller
              name="contactDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RichEditor label="Descrição" value={field.value} onChange={field.onChange} />
              )}
            />
          </Stack>
        </Box>
      </Paper>
      <Paper elevation={1}>
        <Box>
          <HeaderSection title="Morada" description="País, cidade, localidade... do cliente" />
          <Stack sx={{ padding: 3, gap: 3 }}>
            <FormControl fullWidth>
              <TextField
                {...register("country")}
                label="País"
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                {...register("city")}
                label="Cidade"
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                {...register("locality")}
                label="Localidade"
                error={!!errors.locality}
                helperText={errors.locality?.message}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                {...register("address")}
                label="Morada"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                {...register("postalCode")}
                label="Código postal"
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
              />
            </FormControl>
          </Stack>
        </Box>
      </Paper>
    </>
  )
}

export default EditClientForm
