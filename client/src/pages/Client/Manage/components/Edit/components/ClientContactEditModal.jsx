import React, { useEffect, useRef } from "react"

import { useForm, useFormState, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientContactSchema } from "@schemas/client"

import { useClient } from "@hooks/server/useClient"

import { MuiTelInput } from "mui-tel-input"
import { Grid, Box, FormControl, TextField } from "@mui/material"

import { Modal, Select, RichEditor } from "@components/ui"

import { showSuccessToast, showErrorToast } from "@config/toast"

const ClientContactEditModal = ({ clientContact, open, onClose }) => {
  const typeSelectRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      if (open && typeSelectRef.current) {
        typeSelectRef.current.focus()
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
    resolver: zodResolver(clientContactSchema)
  })

  const initialValues = {
    type: clientContact?.type || "",
    contact: clientContact?.contact || "",
    description: clientContact?.description || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (clientContact) {
      reset(initialValues)
    }
  }, [clientContact])

  const { updateContactClient } = useClient()

  const onSubmit = async (data) => {
    if (!isFormUnchanged()) {
      return new Promise((resolve, reject) => {
        updateContactClient
          .mutateAsync({
            clientId: clientContact.client_id,
            contactId: clientContact.id,
            ...data,
            description: data.description === "" ? null : data.description
          })
          .then(() => {
            onClose()
            showSuccessToast("Contacto atualizado com sucesso!")
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "CLI-004") {
              setError("contact", {
                type: "manual",
                message: "Já existe um contacto com o mesmo tipo e valor para este cliente"
              })
              return reject()
            }

            onClose()
            showErrorToast("Erro ao atualizar contacto!")
            reject()
          })
      })
    }
  }

  const watchType = useWatch({ control, name: "type" })

  return (
    <Modal
      mode="form"
      title="Editar Contacto"
      open={open}
      onClose={onClose}
      submitButtonText="Editar Contacto"
      onSubmit={handleSubmit(onSubmit)}
      disabled={isFormUnchanged()}
    >
      <Box sx={{ padding: 3, paddingTop: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    ref={field.ref}
                    label="Tipo"
                    data={["", "E-mail", "Telefone", "Telemóvel", "Outro"]}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    inputRef={typeSelectRef}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {watchType === "E-mail" ? (
              <FormControl fullWidth>
                <TextField
                  {...register("contact")}
                  label="E-mail"
                  error={!!errors.contact}
                  helperText={errors.contact?.message}
                  autoComplete="off"
                  InputLabelProps={{ shrink: getValues("contact")?.length > 0 }}
                />
              </FormControl>
            ) : (
              <>
                {watchType === "Telefone" || watchType === "Telemóvel" ? (
                  <FormControl fullWidth>
                    <Controller
                      name="contact"
                      control={control}
                      render={({ field }) => (
                        <MuiTelInput
                          {...field}
                          value={
                            initialValues.type === "Telefone" || initialValues.type === "Telemóvel"
                              ? field.value
                              : "+351"
                          }
                          defaultCountry={"pt"}
                          label={watchType}
                          variant="outlined"
                          fullWidth
                          error={!!errors.contact}
                          helperText={errors.contact?.message}
                          autoComplete="off"
                          disableDropdown
                        />
                      )}
                    />
                  </FormControl>
                ) : (
                  <FormControl fullWidth>
                    <TextField
                      {...register("contact")}
                      label="Contacto"
                      error={!!errors.contact}
                      helperText={errors.contact?.message}
                      autoComplete="off"
                      InputLabelProps={{ shrink: getValues("contact")?.length > 0 }}
                    />
                  </FormControl>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichEditor label="Descrição" value={field.value} onChange={field.onChange} />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ClientContactEditModal
