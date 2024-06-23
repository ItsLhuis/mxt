import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import {
  Box,
  Stack,
  Paper,
  Divider,
  ListItemText,
  Typography,
  Tooltip,
  IconButton
} from "@mui/material"
import { History, MoreVert, Edit, Delete, Check, Close } from "@mui/icons-material"

import {
  HeaderSection,
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton
} from "@components/ui"

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
        label: "Responsável",
        align: "left",
        sortable: false,
        renderComponent: ({ row }) => (
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
              <ListItemText
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
              </ListItemText>
            </Stack>
            <Divider
              sx={{
                borderColor: "var(--elevation-level5)",
                borderWidth: 1
              }}
            />
            <ListItemText
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
            </ListItemText>
          </Stack>
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
                        <Box dangerouslySetInnerHTML={formatHTML(row.before)} />
                      </Box>
                    )
                  }
                }

                if (row.field === "Contacto") {
                  if (row.before) {
                    return formatPhoneNumber(row.before)
                  }
                }

                return row.before
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
                        <Box dangerouslySetInnerHTML={formatHTML(row.after)} />
                      </Box>
                    )
                  }
                }

                if (row.field === "Contacto") {
                  if (row.after) {
                    return formatPhoneNumber(row.after)
                  }
                }
                return row.after
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

        return (
          <Box
            sx={{
              border: "1px solid var(--elevation-level5)",
              borderRadius: 2,
              overflow: "hidden",
              margin: 3
            }}
          >
            <Table data={row.details ?? []} columns={interactionsHistoryDetailsTableColumns} />
          </Box>
        )
      },
    []
  )

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Histórico de Atividades"
        description="Histórico de atividades sobre os clientes"
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
              data={isClientFinished ? client[0].interactions_history : []}
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
