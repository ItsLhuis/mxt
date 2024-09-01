import React, { useState, useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useRepair } from "@hooks/server/useRepair"

import { FileSvg, ImgSvg, PdfSvg } from "@assets/icons/files"

import { Link } from "react-router-dom"
import { Stack, Box, Typography, Divider, Tooltip, IconButton, Chip } from "@mui/material"
import {
  MoreVert,
  Edit,
  Delete,
  Attachment,
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

import { getValidChipColor } from "@utils/getValidChipColor"
import { formatHTML } from "@utils/format/formatHTML"
import {
  formatDateTimeExportExcel,
  formatDateTime,
  formatDate,
  formatTime
} from "@utils/format/date"

const RepairTable = () => {
  const navigate = useNavigate()

  const { role } = useAuth()

  const { findAllRepairs, deleteRepair } = useRepair()
  const { data: repairs, isLoading: isRepairsLoading } = findAllRepairs

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

  const [deleteRepairModal, setDeleteRepairModal] = useState({
    isOpen: false,
    repairId: null
  })
  const openDeleteRepairModal = (id) => {
    setDeleteRepairModal({ isOpen: true, repairId: id })
  }
  const closeDeleteRepairModal = () => {
    setDeleteRepairModal({ isOpen: false, repairId: null })
  }

  const handleDeleteClient = () => {
    return new Promise((resolve, reject) => {
      if (deleteRepairModal.repairId) {
        deleteRepair
          .mutateAsync({ repairId: deleteRepairModal.repairId })
          .then(() => {
            closeDeleteRepairModal()
            resolve()
          })
          .catch(() => {
            closeDeleteRepairModal()
            reject()
          })
      } else {
        closeDeleteRepairModal()
        reject()
      }
    })
  }

  const repairsTableColumns = useMemo(
    () => [
      {
        id: "status.name",
        label: "Estado",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Link to={`/repair/${row?.id}`}>
            <Chip label={row?.status?.name} color={getValidChipColor(row?.status?.color)} />
          </Link>
        )
      },
      {
        id: "equipment.client.name",
        label: "Cliente",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, whiteSpace: "pre" }}>
            <Link to={`/client/${row?.equipment?.client?.id}`}>{row?.equipment?.client?.name}</Link>
            {row?.equipment?.client?.description && (
              <Caption title={row?.equipment?.client?.description} />
            )}
          </Stack>
        )
      },
      {
        id: "equipment.type.name",
        label: "Tipo",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Link to={`/equipment/${row?.equipment?.id}`}>{row?.equipment?.type?.name}</Link>
        )
      },
      {
        id: "equipment.brand.name",
        label: "Marca ",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Link to={`/equipment/${row?.equipment?.id}`}>{row?.equipment?.brand?.name}</Link>
        )
      },
      {
        id: "equipment.model.name",
        label: "Modelo",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Link to={`/equipment/${row?.equipment?.id}`}>{row?.equipment?.model?.name}</Link>
        )
      },
      {
        id: "equipment.sn",
        label: "Número de série",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Link to={`/equipment/${row?.equipment?.id}`}>{row?.equipment?.sn}</Link>
        )
      },
      {
        id: "entry_datetime",
        label: "Data de entrada",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.entry_datetime ? (
              <>{formatDateTime(row?.entry_datetime)}</>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem valor
              </Typography>
            )}
          </>
        )
      },
      {
        id: "conclusion_datetime",
        label: "Data de conclusão",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.conclusion_datetime ? (
              <>{formatDateTime(row?.conclusion_datetime)}</>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem valor
              </Typography>
            )}
          </>
        )
      },
      {
        id: "delivery_datetime",
        label: "Data de entrega",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.delivery_datetime ? (
              <>{formatDateTime(row?.delivery_datetime)}</>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem valor
              </Typography>
            )}
          </>
        )
      },
      {
        id: "is_client_notified",
        label: "Cliente notificado",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ alignItems: "flex-start" }}>
            {row?.is_client_notified ? <Check color="success" /> : <Close color="error" />}
          </Stack>
        )
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
                {!row?.created_by_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
                    <Avatar
                      alt={row?.created_by_user?.username}
                      src={`${BASE_URL}/users/${row?.created_by_user?.id}/avatar?size=80`}
                      name={row?.created_by_user?.username}
                    />
                    <Stack
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <Typography variant="p" component="p" fontWeight={500}>
                        {row?.created_by_user?.username}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {row?.created_by_user?.role}
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
                  {formatDate(row?.created_at_datetime)}
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)">
                  {formatTime(row?.created_at_datetime)}
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
            {row?.last_modified_datetime ? (
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
                  {!row?.last_modified_by_user ? (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  ) : (
                    <>
                      <Avatar
                        alt={row?.last_modified_by_user?.username}
                        src={`${BASE_URL}/users/${row?.last_modified_by_user?.id}/avatar?size=80`}
                        name={row?.last_modified_by_user?.username}
                      />
                      <Stack
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <Typography variant="p" component="p" fontWeight={500}>
                          {row?.last_modified_by_user?.username}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {row?.last_modified_by_user?.role}
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
                    {formatDate(row?.last_modified_datetime)}
                  </Typography>
                  <Typography variant="p" component="p" color="var(--outline)">
                    {formatTime(row?.last_modified_datetime)}
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
                  onClick: () => navigate(`/repair/${row?.id}`)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openDeleteRepairModal(row?.id)
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
                  {row?.responsible_user ? (
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
                          alt={row?.responsible_user?.username}
                          src={`${BASE_URL}/users/${row?.responsible_user?.id}/avatar?size=80`}
                          name={row?.responsible_user?.username}
                        />
                        <Stack
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          <Typography variant="p" component="p" fontWeight={500}>
                            {row?.responsible_user?.username}
                          </Typography>
                          <Typography variant="p" component="p" color="var(--outline)">
                            {row?.responsible_user?.role}
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
                          {formatDate(row?.created_at_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row?.created_at_datetime)}
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

        const ExpandableRepairsInteractionsHistoryTableContent = useMemo(
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
                      if (
                        row?.field === "Descrição da entrada" ||
                        row?.field === "Descrição dos acessórios da entrada" ||
                        row?.field === "Descrição dos problemas reportados" ||
                        row?.field === "Descrição dos trabalhos realizados" ||
                        row?.field === "Descrição dos acessórios da intervenção" ||
                        row?.field === "Descrição da intervenção"
                      ) {
                        if (row?.before) {
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
                                dangerouslySetInnerHTML={formatHTML(row?.before)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row?.field === "Estado") {
                        if (row?.before) {
                          return (
                            <Chip
                              label={row?.before?.name}
                              color={getValidChipColor(row?.before?.color)}
                            />
                          )
                        }
                      }

                      if (
                        row?.field === "Data de entrada" ||
                        row?.field === "Data de conclusão" ||
                        row?.field === "Data de entrega"
                      ) {
                        if (row?.before) {
                          return <>{formatDateTime(row?.before)}</>
                        }
                      }

                      if (row?.field === "Cliente notificado") {
                        return (
                          <>{row?.before ? <Check color="success" /> : <Close color="error" />}</>
                        )
                      }

                      if (
                        row?.field === "Acessórios da entrada" ||
                        row?.field === "Problemas reportados" ||
                        row?.field === "Trabalhos realizados" ||
                        row?.field === "Acessórios da intervenção"
                      ) {
                        if (row?.before && row?.before.length > 0) {
                          return row?.before.map((item) => item?.name).join(", ")
                        } else {
                          return (
                            <Typography variant="p" component="p" color="var(--outline)">
                              Sem valor
                            </Typography>
                          )
                        }
                      }

                      return row?.before ? (
                        row?.before
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
                      if (
                        row?.field === "Descrição da entrada" ||
                        row?.field === "Descrição dos acessórios da entrada" ||
                        row?.field === "Descrição dos problemas reportados" ||
                        row?.field === "Descrição dos trabalhos realizados" ||
                        row?.field === "Descrição dos acessórios da intervenção" ||
                        row?.field === "Descrição da intervenção"
                      ) {
                        if (row?.after) {
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
                                dangerouslySetInnerHTML={formatHTML(row?.after)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row?.field === "Equipamento") {
                        if (row?.after) {
                          return (
                            <Caption
                              fontSize="small"
                              title={
                                <Stack
                                  sx={{
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    gap: 1
                                  }}
                                >
                                  <Typography
                                    variant="h5"
                                    component="h5"
                                    sx={{ wordBreak: "break-all" }}
                                  >
                                    {row?.after?.client?.name}
                                  </Typography>
                                  <Stack
                                    sx={{
                                      flexDirection: "row",
                                      gap: 1,
                                      width: "100%"
                                    }}
                                  >
                                    <Typography
                                      variant="p"
                                      component="p"
                                      sx={{ wordBreak: "break-all" }}
                                    >
                                      {row?.after?.type?.name}
                                    </Typography>
                                    <Divider
                                      flexItem
                                      sx={{
                                        borderColor: "var(--outline)",
                                        borderWidth: 1
                                      }}
                                    />
                                    <Typography
                                      variant="p"
                                      component="p"
                                      sx={{ wordBreak: "break-all" }}
                                    >
                                      {row?.after?.brand?.name} {row?.after?.model?.name}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              }
                            />
                          )
                        }
                      }

                      if (row?.field === "Estado") {
                        if (row?.after) {
                          return (
                            <Chip
                              label={row?.after?.name}
                              color={getValidChipColor(row?.after?.color)}
                            />
                          )
                        }
                      }

                      if (
                        row?.field === "Data de entrada" ||
                        row?.field === "Data de conclusão" ||
                        row?.field === "Data de entrega"
                      ) {
                        if (row?.after) {
                          return <>{formatDateTime(row?.after)}</>
                        }
                      }

                      if (row?.field === "Cliente notificado") {
                        return (
                          <>{row?.after ? <Check color="success" /> : <Close color="error" />}</>
                        )
                      }

                      if (
                        row?.field === "Acessórios da entrada" ||
                        row?.field === "Problemas reportados" ||
                        row?.field === "Trabalhos realizados" ||
                        row?.field === "Acessórios da intervenção"
                      ) {
                        if (row?.after && row?.after.length > 0) {
                          return row?.after.map((item) => item?.name).join(", ")
                        } else {
                          return (
                            <Typography variant="p" component="p" color="var(--outline)">
                              Sem valor
                            </Typography>
                          )
                        }
                      }

                      return row?.after ? (
                        row?.after
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
                      <>{row?.changed ? <Check color="success" /> : <Close color="error" />}</>
                    )
                  }
                ],
                []
              )

              const interactionsHistoryAttachmentDetailsTableColumns = useMemo(
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
                  }
                ],
                []
              )

              return (
                <Box
                  sx={{
                    border: "1px solid var(--elevation-level5)",
                    borderRadius: 2,
                    overflow: "hidden",
                    margin: 3
                  }}
                >
                  {row?.details[0]?.field === "Anexos" ? (
                    <>
                      {row?.details[0]?.after ? (
                        <Table
                          data={row?.details[0]?.after ?? []}
                          columns={interactionsHistoryAttachmentDetailsTableColumns}
                        />
                      ) : (
                        <Table
                          showSearch={false}
                          data={[row?.details[0]?.before]}
                          columns={interactionsHistoryAttachmentDetailsTableColumns}
                        />
                      )}
                    </>
                  ) : (
                    <Table
                      data={row?.details ?? []}
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
                description="Anexos da reparação"
                icon={<Attachment />}
              />
              <Table
                mode="datatable"
                data={row?.attachments ?? []}
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
                  description="Histórico de atividades sobre a reparação"
                  icon={<History />}
                />
                <Table
                  mode="datatable"
                  data={row?.interactions_history ?? []}
                  columns={interactionsHistoryTableColumns}
                  ExpandableContentComponent={ExpandableRepairsInteractionsHistoryTableContent}
                />
              </Box>
            )}
          </Stack>
        )
      },
    []
  )

  const repairsTableExportColumns = useMemo(
    () => [
      {
        id: "equipment.client.name",
        label: "Cliente"
      },
      {
        id: "equipment",
        label: "Equipamento",
        formatter: (value) =>
          `${value?.type?.name} - ${value?.brand?.name} ${value?.model?.name} (${value?.sn})`
      },
      {
        id: "status",
        label: "Estado",
        formatter: (value) => value?.name,
        color: (value) => value?.color
      },
      {
        id: "entry_datetime",
        label: "Data de entrada",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "conclusion_datetime",
        label: "Data de conclusão",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "delivery_datetime",
        label: "Data de entrega",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "is_client_notified",
        label: "Cliente notificado",
        formatter: (value) => (value === true ? "Sim" : "Não")
      },
      {
        id: "created_by_user.username",
        label: "Criado por"
      },
      {
        id: "created_at_datetime",
        label: "Data de criação",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "last_modified_by_user.username",
        label: "Modificado pela última vez por"
      },
      {
        id: "last_modified_datetime",
        label: "Última data de modificação",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      }
    ],
    []
  )

  return (
    <Box>
      <Loadable
        isLoading={isRepairsLoading}
        LoadingComponent={<TableSkeleton mode="datatable" />}
        LoadedComponent={
          <Table
            mode="datatable"
            data={repairs ?? []}
            columns={repairsTableColumns}
            exportFileName="reparacoes"
            exportColumns={repairsTableExportColumns}
            ExpandableContentComponent={ExpandableClientsTableContent}
          />
        }
      />
      <Modal
        mode="delete"
        title="Eliminar Reparação"
        open={deleteRepairModal.isOpen}
        onClose={closeDeleteRepairModal}
        onSubmit={handleDeleteClient}
        description="Tem a certeza que deseja eliminar esta reparação?"
        subDescription="Ao eliminar esta reparação, todos os dados relacionados, incluindo anexos, serão removidos de forma permanente."
      />
      <FileViewer
        open={openFileViewer}
        onClose={handleCloseFileViewer}
        file={attachment.url}
        fileName={attachment.name}
        fileSize={Number(attachment.size)}
        fileType={attachment.type}
      />
    </Box>
  )
}

export default RepairTable
