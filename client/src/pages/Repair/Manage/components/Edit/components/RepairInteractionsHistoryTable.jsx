import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import { Box, Stack, Paper, Divider, Typography, Chip } from "@mui/material"
import { History, Check, Close, PictureAsPdf, Image, QuestionMark } from "@mui/icons-material"

import { HeaderSection, Loadable, Table, TableSkeleton, Avatar, Caption } from "@components/ui"

import { getValidChipColor } from "@utils/getValidChipColor"
import { formatHTML } from "@utils/format/formatHTML"
import { formatDateTime, formatDate, formatTime } from "@utils/format/date"

const RepairInteractionsHistoryTable = ({ repair, isLoading, isError }) => {
  const isRepairFinished = !isLoading && !isError

  const repairInteractionsHistoryTableColumns = useMemo(
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
                  return <>{row?.before ? <Check color="success" /> : <Close color="error" />}</>
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
                              gap: 0.5
                            }}
                          >
                            <Typography variant="h5" component="h5" sx={{ wordBreak: "break-all" }}>
                              {row?.after?.client?.name}
                            </Typography>
                            <Stack
                              sx={{
                                flexDirection: "row",
                                width: "100%"
                              }}
                            >
                              <Typography variant="p" component="p" sx={{ wordBreak: "break-all" }}>
                                {row?.after?.type?.name}, {row?.after?.brand?.name}
                                {row?.after?.model?.name}
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
                      <Chip label={row?.after?.name} color={getValidChipColor(row?.after?.color)} />
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
                  return <>{row?.after ? <Check color="success" /> : <Close color="error" />}</>
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
                    data={[row.details[0].before]}
                    columns={interactionsHistoryAttachmentDetailsTableColumns}
                  />
                )}
              </>
            ) : (
              <Table data={row.details ?? []} columns={interactionsHistoryDetailsTableColumns} />
            )}
          </Box>
        )
      },
    []
  )

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Histórico de Atividades"
        description="Histórico de atividades sobre a reparação"
        icon={<History />}
      />
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
              data={isRepairFinished ? repair[0].interactions_history : []}
              columns={repairInteractionsHistoryTableColumns}
              ExpandableContentComponent={ExpandableRepairsInteractionsHistoryTableContent}
            />
          </Box>
        }
      />
    </Paper>
  )
}

export default RepairInteractionsHistoryTable
