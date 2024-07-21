import React from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { equipmentAttachmentSchema } from "@schemas/equipment"

import { useEquipment } from "@hooks/server/useEquipment"

import { LoadingButton } from "@mui/lab"
import { Box, Stack } from "@mui/material"
import { Attachment } from "@mui/icons-material"

import { HeaderSection, FileUpload } from "@components/ui"

const EquipmentAttachmentsForm = ({ equipment, isLoading, isError }) => {
  const isEquipmentFinished = !isLoading && !isError

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(equipmentAttachmentSchema),
    defaultValues: {
      attachments: []
    }
  })

  const { addNewEquipmentAttachment } = useEquipment()

  const onSubmit = async (data) => {
    if (!isEquipmentFinished) return

    await addNewEquipmentAttachment
      .mutateAsync({
        equipmentId: equipment[0].id,
        ...data
      })
      .then(() => reset())
  }

  return (
    <Stack>
      <HeaderSection
        title="Anexos"
        description="Adicionar novos anexos ao equipamento"
        icon={<Attachment />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ padding: 3, gap: 3 }}>
          <Controller
            name="attachments"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FileUpload
                disabled={addNewEquipmentAttachment.isPending}
                value={field.value}
                onChange={field.onChange}
                error={!!errors.attachments}
                helperText={errors.attachments?.message}
              />
            )}
          />
          <Box sx={{ marginLeft: "auto" }}>
            <LoadingButton
              loading={addNewEquipmentAttachment.isPending}
              type="submit"
              variant="contained"
              disabled={!isEquipmentFinished}
            >
              Adicionar Anexos
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}

export default EquipmentAttachmentsForm
