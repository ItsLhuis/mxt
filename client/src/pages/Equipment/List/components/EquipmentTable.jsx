import React, { useState, useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useEquipment } from "@hooks/server/useEquipment"

import { Link } from "react-router-dom"
import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton, Button } from "@mui/material"
import {
  MoreVert,
  Edit,
  Delete,
  Attachment,
  PictureAsPdf,
  Image,
  QuestionMark,
  Visibility,
  History,
  Check,
  Close
} from "@mui/icons-material"

import {
  HeaderSection,
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton,
  Caption,
  FileViewer,
  Modal
} from "@components/ui"

import { formatHTML } from "@utils/format/formatHTML"
import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const ClientTable = () => {
  const navigate = useNavigate()

  const { role } = useAuth()

  const { findAllEquipments } = useEquipment()
  const { data: equipments, isLoading: isEquipmentsLoading } = findAllEquipments

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

  /*   const [deleteClientModal, setDeleteClientModal] = useState({ isOpen: false, clientId: null })
  const openDeleteClientModal = (id) => {
    setDeleteClientModal({ isOpen: true, clientId: id })
  }
  const closeDeleteClientModal = () => {
    setDeleteClientModal({ isOpen: false, clientId: null })
  }

  const handleDeleteClient = () => {
    return new Promise((resolve, reject) => {
      if (deleteClientModal.clientId) {
        deleteClient
          .mutateAsync({ clientId: deleteClientModal.clientId })
          .then(() => {
            closeDeleteClientModal()
            resolve()
          })
          .catch(() => {
            closeDeleteClientModal()
            reject()
          })
      } else {
        closeDeleteClientModal()
        reject()
      }
    })
  } */

  const equipmentsTableColumns = useMemo(
    () => [
      {
        id: "client.name",
        label: "Cliente",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            {row.client.name}
            {row.client.description && (
              <Caption fontSize="small" title={row.client.description} isHtml />
            )}
          </Stack>
        )
      },
      {
        id: "type.name",
        label: "Tipo",
        align: "left",
        sortable: true
      },
      {
        id: "brand.name",
        label: "Marca ",
        align: "left",
        sortable: true
      },
      {
        id: "model.name",
        label: "Modelo",
        align: "left",
        sortable: true
      },
      {
        id: "sn",
        label: "Número de série",
        align: "left",
        sortable: true
      },
      {
        id: "created_by_user",
        visible: false
      },
      {
        id: "created_at_datetime",
        label: "Criado por",
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
                {!row.created_by_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
                    <Avatar
                      alt={row.created_by_user.username}
                      src={`${BASE_URL}/users/${row.created_by_user.id}/avatar?size=80`}
                      name={row.created_by_user.username}
                    />
                    <Stack
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <Typography variant="p" component="p" fontWeight={500}>
                        {row.created_by_user.username}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {row.created_by_user.role}
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
                  {formatDate(row.created_at_datetime)}
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)">
                  {formatTime(row.created_at_datetime)}
                </Typography>
              </Stack>
            </Stack>
          </>
        )
      },
      {
        id: "last_modified_by_user",
        visible: false
      },
      {
        id: "last_modified_datetime",
        label: "Modificado pela última vez por",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row.last_modified_datetime ? (
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
                  {!row.last_modified_by_user ? (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  ) : (
                    <>
                      <Avatar
                        alt={row.last_modified_by_user.username}
                        src={`${BASE_URL}/users/${row.last_modified_by_user.id}/avatar?size=80`}
                        name={row.last_modified_by_user.username}
                      />
                      <Stack
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <Typography variant="p" component="p" fontWeight={500}>
                          {row.last_modified_by_user.username}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {row.last_modified_by_user.role}
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
                    {formatDate(row.last_modified_datetime)}
                  </Typography>
                  <Typography variant="p" component="p" color="var(--outline)">
                    {formatTime(row.last_modified_datetime)}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Ainda não foi modificado
              </Typography>
            )}
          </>
        )
      },
      {
        id: "more_options",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => (
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
                  label: "Editar",
                  icon: <Edit fontSize="small" />,
                  onClick: () => navigate(`/client/${row.id}`)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openDeleteClientModal(row.id)
                      }
                    ]
                  : [])
              ]}
            />
          </ButtonDropDownSelect>
        )
      }
    ],
    []
  )

  const ExpandableClientsTableContent = useMemo(
    () =>
      ({ row }) => {
        const attachmentsTableColumns = useMemo(
          () => [
            {
              id: "file_mime_type",
              align: "left",
              sortable: true,
              renderComponent: ({ row }) => (
                <Stack sx={{ alignItems: "flex-start" }}>
                  {row.file_mime_type === "application/pdf" ? (
                    <PictureAsPdf fontSize="medium" sx={{ color: "rgb(223, 88, 84)" }} />
                  ) : row.file_mime_type.startsWith("image/") ? (
                    <Image fontSize="medium" sx={{ color: "rgb(245, 128, 8)" }} />
                  ) : (
                    <QuestionMark fontSize="medium" sx={{ color: "var(--outline)" }} />
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
                    {row.original_filename}
                  </Typography>
                  <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                    {`${
                      row.file_size < 1024 * 1024
                        ? (row.file_size / 1024).toFixed(2) + " Kb"
                        : (row.file_size / (1024 * 1024)).toFixed(2) + " Mb"
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
                      {!row.uploaded_by_user ? (
                        <Typography variant="p" component="p" color="var(--outline)">
                          Utilizador removido
                        </Typography>
                      ) : (
                        <>
                          <Avatar
                            alt={row.uploaded_by_user.username}
                            src={`${BASE_URL}/users/${row.uploaded_by_user.id}/avatar?size=80`}
                            name={row.uploaded_by_user.username}
                          />
                          <Stack
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            <Typography variant="p" component="p" fontWeight={500}>
                              {row.uploaded_by_user.username}
                            </Typography>
                            <Typography variant="p" component="p" color="var(--outline)">
                              {row.uploaded_by_user.role}
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
                        {formatDate(row.uploaded_at_datetime)}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {formatTime(row.uploaded_at_datetime)}
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
                        `${BASE_URL}/equipments/${row.equipment_id}/attachments/${row.id}/${row.original_filename}`,
                        row.original_filename,
                        row.file_size,
                        row.file_mime_type
                      )
                    }
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              )
            }
          ],
          []
        )

        const interactionsHistoryTableColumns = useMemo(
          () => [
            {
              id: "type",
              label: "Atividade",
              align: "left",
              sortable: true
            },
            {
              id: "responsible_user",
              label: "Responsável",
              align: "left",
              sortable: false,
              renderComponent: ({ row }) => (
                <>
                  {row.responsible_user ? (
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
                        <Avatar
                          alt={row.responsible_user.username}
                          src={`${BASE_URL}/users/${row.responsible_user.id}/avatar?size=80`}
                          name={row.responsible_user.username}
                        />
                        <Stack
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          <Typography variant="p" component="p" fontWeight={500}>
                            {row.responsible_user.username}
                          </Typography>
                          <Typography variant="p" component="p" color="var(--outline)">
                            {row.responsible_user.role}
                          </Typography>
                        </Stack>
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
                          {formatDate(row.created_at_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row.created_at_datetime)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  )}
                </>
              )
            }
          ],
          []
        )

        const ExpandableClientsInteractionsHistoryTableContent = useMemo(
          () =>
            ({ row }) => {
              const interactionsHistoryDetailsTableColumns = useMemo(
                () => [
                  {
                    id: "field",
                    label: "Campo",
                    align: "left",
                    sortable: true
                  },
                  {
                    id: "before",
                    label: "Antes",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => {
                      if (row.field === "Descrição") {
                        if (row.before) {
                          return (
                            <Box
                              sx={{
                                maxHeight: 300,
                                overflow: "hidden",
                                overflowY: "auto",
                                borderRadius: "8px",
                                border: "1px solid var(--elevation-level5)",
                                padding: 2
                              }}
                            >
                              <span
                                className="table-cell-tiptap-editor"
                                dangerouslySetInnerHTML={formatHTML(row.before)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row.field === "Cliente") {
                        if (row.before) {
                          return (
                            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                              {row.before.name}
                              {row.before.description && (
                                <Caption fontSize="small" title={row.before.description} isHtml />
                              )}
                            </Stack>
                          )
                        }
                      }

                      if (row.field === "Tipo") {
                        if (row.before) {
                          return <>{row.before.name}</>
                        }
                      }

                      if (row.field === "Marca") {
                        if (row.before) {
                          return <>{row.before.name}</>
                        }
                      }

                      if (row.field === "Modelo") {
                        if (row.before) {
                          return <>{row.before.name}</>
                        }
                      }

                      return row.before ? (
                        row.before
                      ) : (
                        <Typography variant="p" component="p" color="var(--outline)">
                          Sem valor
                        </Typography>
                      )
                    }
                  },
                  {
                    id: "after",
                    label: "Depois",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => {
                      if (row.field === "Descrição") {
                        if (row.after) {
                          return (
                            <Box
                              sx={{
                                maxHeight: 300,
                                overflow: "hidden",
                                overflowY: "auto",
                                borderRadius: "8px",
                                border: "1px solid var(--elevation-level5)",
                                padding: 2
                              }}
                            >
                              <span
                                className="table-cell-tiptap-editor"
                                dangerouslySetInnerHTML={formatHTML(row.after)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row.field === "Cliente") {
                        if (row.after) {
                          return (
                            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                              {row.after.name}
                              {row.after.description && (
                                <Caption fontSize="small" title={row.after.description} isHtml />
                              )}
                            </Stack>
                          )
                        }
                      }

                      if (row.field === "Tipo") {
                        if (row.after) {
                          return <>{row.after.name}</>
                        }
                      }

                      if (row.field === "Marca") {
                        if (row.after) {
                          return <>{row.after.name}</>
                        }
                      }

                      if (row.field === "Modelo") {
                        if (row.after) {
                          return <>{row.after.name}</>
                        }
                      }

                      return row.after ? (
                        row.after
                      ) : (
                        <Typography variant="p" component="p" color="var(--outline)">
                          Sem valor
                        </Typography>
                      )
                    }
                  },
                  {
                    id: "changed",
                    label: "Alterado",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => (
                      <>{row.changed ? <Check color="success" /> : <Close color="error" />}</>
                    )
                  }
                ],
                []
              )

              const interactionsHistoryAttachmentDetailsTableColumns = useMemo(
                () => [
                  {
                    id: "file_mime_type",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => (
                      <Stack sx={{ alignItems: "flex-start" }}>
                        {row.file_mime_type === "application/pdf" ? (
                          <PictureAsPdf fontSize="medium" sx={{ color: "rgb(223, 88, 84)" }} />
                        ) : row.file_mime_type.startsWith("image/") ? (
                          <Image fontSize="medium" sx={{ color: "rgb(245, 128, 8)" }} />
                        ) : (
                          <QuestionMark fontSize="medium" sx={{ color: "var(--outline)" }} />
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
                          {row.original_filename}
                        </Typography>
                        <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                          {`${
                            row.file_size < 1024 * 1024
                              ? (row.file_size / 1024).toFixed(2) + " Kb"
                              : (row.file_size / (1024 * 1024)).toFixed(2) + " Mb"
                          }`}
                        </Typography>
                      </Stack>
                    )
                  }
                ],
                []
              )

              console.log(row.details[0])

              return (
                <Box
                  sx={{
                    border: "1px solid var(--elevation-level5)",
                    borderRadius: 2,
                    overflow: "hidden",
                    margin: 3
                  }}
                >
                  {row.details[0].field === "Anexos" ? (
                    <>
                      {row.details[0].after ? (
                        <Table
                          data={row.details[0].after ?? []}
                          columns={interactionsHistoryAttachmentDetailsTableColumns}
                        />
                      ) : (
                        <Table
                          showSearch={false}
                          data={[row.details[0].before] ?? []}
                          columns={interactionsHistoryAttachmentDetailsTableColumns}
                        />
                      )}
                    </>
                  ) : (
                    <Table
                      data={row.details ?? []}
                      columns={interactionsHistoryDetailsTableColumns}
                    />
                  )}
                </Box>
              )
            },
          []
        )

        return (
          <Stack sx={{ margin: 3, gap: 3 }}>
            <Box
              sx={{
                border: "1px solid var(--elevation-level5)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <HeaderSection
                title="Anexos"
                description="Anexos do equipamento"
                icon={<Attachment />}
              />
              <Table
                mode="datatable"
                data={row.attachments ?? []}
                columns={attachmentsTableColumns}
              />
            </Box>
            {role !== "Funcionário" && (
              <Box
                sx={{
                  border: "1px solid var(--elevation-level5)",
                  borderRadius: 2,
                  overflow: "hidden"
                }}
              >
                <HeaderSection
                  title="Histórico de Atividades"
                  description="Histórico de atividades sobre o equipamento"
                  icon={<History />}
                />
                <Table
                  mode="datatable"
                  data={row.interactions_history ?? []}
                  columns={interactionsHistoryTableColumns}
                  ExpandableContentComponent={ExpandableClientsInteractionsHistoryTableContent}
                />
              </Box>
            )}
          </Stack>
        )
      },
    []
  )

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isEquipmentsLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={equipments ?? []}
              columns={equipmentsTableColumns}
              ExpandableContentComponent={ExpandableClientsTableContent}
            />
          }
        />
        {/*         <Modal
          mode="delete"
          title="Eliminar Cliente"
          open={deleteClientModal.isOpen}
          onClose={closeDeleteClientModal}
          onSubmit={handleDeleteClient}
          description="Tem a certeza que deseja eliminar este cliente?"
          subDescription="Ao eliminar este cliente, todos os dados relacionados, incluindo contactos, moradas, equipamentos e reparações associadas, serão removidos de forma permanente."
        /> */}
        <FileViewer
          open={openFileViewer}
          onClose={handleCloseFileViewer}
          file={attachment.url}
          fileName={attachment.name}
          fileSize={Number(attachment.size)}
          fileType={attachment.type}
        />
      </Box>
    </Paper>
  )
}

export default ClientTable
