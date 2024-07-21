import React, { useEffect, useRef } from "react"

import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientAddressSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { Grid, Box, Stack, FormControl, TextField } from "@mui/material"

import { Modal } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const ClientAddressEditModal = ({ clientAddress, open, onClose }) => {
  const countryInputRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      if (open && countryInputRef.current) {
        countryInputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(clientAddressSchema)
  })

  const initialValues = {
    country: clientAddress?.country || "",
    city: clientAddress?.city || "",
    locality: clientAddress?.locality || "",
    address: clientAddress?.address || "",
    postalCode: clientAddress?.postal_code || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (clientAddress) {
      reset(initialValues)
    }
  }, [clientAddress])

  const { updateAddressClient } = useClient()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateAddressClient
          .mutateAsync({ clientId: clientAddress.client_id, addressId: clientAddress.id, ...data })
          .then(() => {
            onClose()
            showSuccessToast("Morada atualizada com sucesso!")
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "CLI-004") {
              const fields = ["country", "city", "locality", "address", "postalCode"]
              fields.forEach((field) => {
                setError(field, {
                  type: "manual",
                  message: "Já existe uma morada com os mesmos valores para este cliente"
                })
              })
              return reject()
            }

            onClose()
            showErrorToast("Erro ao atualizar morada!")
            reject()
          })
      })
    }
  }

  return (
    <Modal
      mode="form"
      title="Editar Morada"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Morada"
      onSubmit={handleSubmit(onSubmit)}
      disabled={isFormUnchanged()}
    >
      <Box sx={{ padding: 3, paddingTop: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register("country")}
                label="País"
                error={!!errors.country}
                helperText={errors.country?.message}
                autoComplete="off"
                inputRef={countryInputRef}
                InputLabelProps={{ shrink: getValues("country")?.length > 0 }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register("city")}
                label="Cidade"
                error={!!errors.city}
                helperText={errors.city?.message}
                autoComplete="off"
                InputLabelProps={{ shrink: getValues("city")?.length > 0 }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register("locality")}
                label="Localidade"
                error={!!errors.locality}
                helperText={errors.locality?.message}
                autoComplete="off"
                InputLabelProps={{ shrink: getValues("locality")?.length > 0 }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Stack sx={{ flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <TextField
                  {...register("address")}
                  label="Morada"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  autoComplete="off"
                  InputLabelProps={{ shrink: getValues("address")?.length > 0 }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  {...register("postalCode")}
                  label="Código Postal"
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                  autoComplete="off"
                  InputLabelProps={{ shrink: getValues("postalCode")?.length > 0 }}
                />
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ClientAddressEditModal
