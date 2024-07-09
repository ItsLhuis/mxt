import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import { Box, Stack, Paper, Divider, Typography } from "@mui/material"
import { History, Check, Close, PictureAsPdf, Image, QuestionMark } from "@mui/icons-material"

import { HeaderSection, Loadable, Table, TableSkeleton, Avatar } from "@components/ui"

import { formatHTML } from "@utils/format/formatHTML"
import { formatDate, formatTime } from "@utils/format/date"

const ClientInteractionsHistoryTable = ({ equipment, isLoading, isError }) => {
  const isEquipmentFinished = !isLoading && !isError

  const equipmentInteractionsHistoryTableColumns = useMemo(
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

  const ExpandableEquipmentsInteractionsHistoryTableContent = useMemo(
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
        description="Histórico de atividades sobre o equipamento"
        icon={<History />}
      />
      <Loadable
        isLoading={!isEquipmentFinished}
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
              data={isEquipmentFinished ? equipment[0].interactions_history : []}
              columns={equipmentInteractionsHistoryTableColumns}
              ExpandableContentComponent={ExpandableEquipmentsInteractionsHistoryTableContent}
            />
          </Box>
        }
      />
    </Paper>
  )
}

export default ClientInteractionsHistoryTable
