import React from "react"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { repairAttachmentSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { LoadingButton } from "@mui/lab"
import { Box, Stack } from "@mui/material"
import { Attachment } from "@mui/icons-material"

import { HeaderSection, FileUpload } from "@components/ui"

const RepairAttachmentsForm = ({ repair, isLoading, isError }) => {
  const isRepairFinished = !isLoading && !isError

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(repairAttachmentSchema),
    defaultValues: {
      attachments: []
    }
  })

  const { addNewRepairAttachment } = useRepair()

  const onSubmit = async (data) => {
    if (!isRepairFinished) return

    await addNewRepairAttachment
      .mutateAsync({
        repairId: repair[0].id,
        ...data
      })
      .then(() => reset())
  }

  return (
    <Stack>
      <HeaderSection
        title="Anexos"
        description="Adicionar novos anexos à reparação"
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
                disabled={addNewRepairAttachment.isPending}
                value={field.value}
                onChange={field.onChange}
                error={!!errors.attachments}
                helperText={errors.attachments?.message}
              />
            )}
          />
          <Box sx={{ marginLeft: "auto" }}>
            <LoadingButton
              loading={addNewRepairAttachment.isPending}
              type="submit"
              variant="contained"
              disabled={!isRepairFinished}
            >
              Adicionar Anexos
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}

export default RepairAttachmentsForm
