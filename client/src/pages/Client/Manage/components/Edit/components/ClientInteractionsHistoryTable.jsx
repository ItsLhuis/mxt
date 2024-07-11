import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import { Box, Stack, Paper, Divider, Typography } from "@mui/material"
import { History, Check, Close } from "@mui/icons-material"

import { HeaderSection, Loadable, Table, TableSkeleton, Avatar } from "@components/ui"

import { formatHTML } from "@utils/format/formatHTML"
import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const ClientInteractionsHistoryTable = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const clientInteractionsHistoryTableColumns = useMemo(
    () => [
      {
        id: "type",
        label: "Atividade",
        align: "left",
        sortable: true
      },
      {
        id: "responsible_user",
        visible: false
      },
      {
        id: "created_at_datetime",
        label: "Responsável",
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
                {!row?.responsible_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
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
                if (row?.field === "Descrição") {
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

                if (row?.field === "Contacto") {
                  if (row?.before) {
                    return formatPhoneNumber(row?.before)
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
                if (row?.field === "Descrição") {
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

                if (row?.field === "Contacto") {
                  if (row?.after) {
                    return formatPhoneNumber(row?.after)
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

        return (
          <Box
            sx={{
              border: "1px solid var(--elevation-level5)",
              borderRadius: 2,
              overflow: "hidden",
              margin: 3
            }}
          >
            <Table data={row?.details ?? []} columns={interactionsHistoryDetailsTableColumns} />
          </Box>
        )
      },
    []
  )

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Histórico de Atividades"
        description="Histórico de atividades sobre o cliente"
        icon={<History />}
      />
      <Loadable
        isLoading={!isClientFinished}
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
              data={isClientFinished ? client[0]?.interactions_history : []}
              columns={clientInteractionsHistoryTableColumns}
              ExpandableContentComponent={ExpandableClientsInteractionsHistoryTableContent}
            />
          </Box>
        }
      />
    </Paper>
  )
}

export default ClientInteractionsHistoryTable
