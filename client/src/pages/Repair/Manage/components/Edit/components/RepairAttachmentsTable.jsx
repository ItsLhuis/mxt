import React, { useState, useMemo } from "react"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useRepair } from "@hooks/server/useRepair"

import { FileSvg, ImgSvg, PdfSvg } from "@assets/icons/files"

import { Box, Stack, Divider, Typography, Tooltip, IconButton } from "@mui/material"
import { Attachment, Visibility, MoreVert, Delete } from "@mui/icons-material"

import {
  HeaderSection,
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton,
  FileViewer,
  Modal
} from "@components/ui"

import { formatDate, formatTime } from "@utils/format/date"

const RepairAttachmentsTable = ({ repair, isLoading, isError }) => {
  const isRepairFinished = !isLoading && !isError

  const { role } = useAuth()

  const { deleteRepairAttachment } = useRepair()

  const [openFileViewer, setOpenFileViewer] = useState(false)
  const [attachment, setAttachment] = useState({ url: "", name: "", size: "", type: "" })
  const handleOpenFileViewer = (url, name, size, type) => {
    setAttachment({ url, name, size, type })
    setOpenFileViewer(true)
  }
  const handleCloseFileViewer = () => {
    setOpenFileViewer(false)
    setAttachment({ url: "", type: "" })
  }

  const [repairDeleteAttachmentModal, setRepairDeleteAttachmentModal] = useState({
    isOpen: false,
    repairAttachment: null
  })
  const openRepairDeleteAttachmentModal = (repairAttachment) => {
    setRepairDeleteAttachmentModal({ isOpen: true, repairAttachment: repairAttachment })
  }
  const closeRepairDeleteAttachmentModal = () => {
    setRepairDeleteAttachmentModal({ isOpen: false, repairAttachment: null })
  }

  const handleDeleteRepairAttachment = () => {
    return new Promise((resolve, reject) => {
      if (repairDeleteAttachmentModal.repairAttachment) {
        deleteRepairAttachment
          .mutateAsync({
            repairId: repairDeleteAttachmentModal.repairAttachment.repair_id,
            attachmentId: repairDeleteAttachmentModal.repairAttachment.id
          })
          .then(() => {
            closeRepairDeleteAttachmentModal()
            resolve()
          })
          .catch(() => {
            closeRepairDeleteAttachmentModal()
            reject()
          })
      } else {
        closeRepairDeleteAttachmentModal()
        reject()
      }
    })
  }

  const repairAttachmentsTableColumns = useMemo(
    () => [
      {
        id: "file_mime_type",
        label: "Tipo",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ alignItems: "flex-start" }}>
            {row?.file_mime_type === "application/pdf" ? (
              <img src={PdfSvg} />
            ) : row?.file_mime_type.startsWith("image/") ? (
              <img src={ImgSvg} />
            ) : (
              <img src={FileSvg} />
            )}
          </Stack>
        )
      },
      {
        id: "original_filename",
        label: "Ficheiro",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack>
            <Typography variant="p" component="p">
              {row?.original_filename}
            </Typography>
            <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
              {`${
                row?.file_size < 1024 * 1024
                  ? (row?.file_size / 1024).toFixed(2) + " Kb"
                  : (row?.file_size / (1024 * 1024)).toFixed(2) + " Mb"
              }`}
            </Typography>
          </Stack>
        )
      },
      {
        id: "uploaded_by_user",
        visible: false
      },
      {
        id: "uploaded_at_datetime",
        label: "Carregado por",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {!row?.uploaded_by_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
                    <Avatar
                      alt={row?.uploaded_by_user?.username}
                      src={`${BASE_URL}/users/${row?.uploaded_by_user?.id}/avatar?size=80`}
                      name={row?.uploaded_by_user?.username}
                    />
                    <Stack
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <Typography variant="p" component="p" fontWeight={500}>
                        {row?.uploaded_by_user?.username}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {row?.uploaded_by_user?.role}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
              <Divider
                sx={{
                  borderColor: "var(--elevation-level5)",
                  borderWidth: 1
                }}
              />
              <Stack
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <Typography variant="p" component="p" fontWeight={500}>
                  {formatDate(row?.uploaded_at_datetime)}
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)">
                  {formatTime(row?.uploaded_at_datetime)}
                </Typography>
              </Stack>
            </Stack>
          </>
        )
      },
      {
        id: "view_file",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => (
          <Tooltip title="Ver anexo" sx={{ margin: -1 }}>
            <IconButton
              onClick={() =>
                handleOpenFileViewer(
                  `${BASE_URL}/repairs/${row?.repair_id}/attachments/${row?.id}/${row?.original_filename}`,
                  row?.original_filename,
                  row?.file_size,
                  row?.file_mime_type
                )
              }
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        )
      },
      {
        id: "more_options",
        align: "right",
        sortable: false,
        disablePadding: true,
        renderComponent: ({ row }) => {
          if (role !== "Funcionário") {
            return (
              <ButtonDropDownSelect
                mode="custom"
                customButton={
                  <Tooltip title="Mais opções" sx={{ margin: -1 }}>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListButton
                  buttons={[
                    {
                      label: "Eliminar",
                      icon: <Delete fontSize="small" color="error" />,
                      color: "error",
                      onClick: () => openRepairDeleteAttachmentModal(row)
                    }
                  ]}
                />
              </ButtonDropDownSelect>
            )
          }
        }
      }
    ],
    []
  )

  return (
    <Stack>
      <HeaderSection title="Anexos" description="Anexos da reparação" icon={<Attachment />} />
      <Loadable
        isLoading={!isRepairFinished}
        LoadingComponent={<TableSkeleton mode="datatable" />}
        LoadedComponent={
          <Box
            sx={{
              margin: 3,
              border: "1px solid var(--elevation-level5)",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <Table
              mode="datatable"
              data={isRepairFinished ? repair[0]?.attachments : []}
              columns={repairAttachmentsTableColumns}
            />
          </Box>
        }
      />
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <FileViewer
        open={openFileViewer}
        onClose={handleCloseFileViewer}
        file={attachment.url}
        fileName={attachment.name}
        fileSize={Number(attachment.size)}
        fileType={attachment.type}
      />
      <Modal
        mode="delete"
        title="Eliminar Anexo"
        open={repairDeleteAttachmentModal.isOpen}
        onClose={closeRepairDeleteAttachmentModal}
        onSubmit={handleDeleteRepairAttachment}
        description="Tem a certeza que deseja eliminar este anexo?"
        subDescription="Ao eliminar este anexo, os dados serão removidos de forma permanente."
      />
    </Stack>
  )
}

export default RepairAttachmentsTable
