import React, { useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { BASE_URL } from "@api"
import { useEmail } from "@hooks/server/useEmail"

import { Link } from "react-router-dom"
import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton } from "@mui/material"
import { Visibility } from "@mui/icons-material"

import { Loadable, Table, TableSkeleton, Avatar, Caption } from "@components/ui"

import { formatDate, formatTime } from "@utils/format/date"

const EmailTable = () => {
  const navigate = useNavigate()

  const { findAllEmails } = useEmail()
  const { data: emails, isLoading: isEmailsLoading } = findAllEmails

  const emailsTableColumns = useMemo(
    () => [
      {
        id: "client.name",
        label: "Cliente",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Link to={`/client/${row?.client?.id}`}>{row?.client?.name}</Link>
            {row?.client?.description && (
              <Caption fontSize="small" title={row?.client?.description} />
            )}
          </Stack>
        )
      },
      {
        id: "to",
        label: "Para",
        align: "left",
        sortable: true
      },
      {
        id: "subject",
        label: "Assunto",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => <Link to={`/email/${row.id}`}>{row?.subject}</Link>
      },
      {
        id: "sent_by_user",
        visible: false
      },
      {
        id: "created_at_datetime",
        label: "Enviado por",
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
                {!row?.sent_by_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
                    <Avatar
                      alt={row?.sent_by_user?.username}
                      src={`${BASE_URL}/users/${row?.sent_by_user?.id}/avatar?size=80`}
                      name={row?.sent_by_user?.username}
                    />
                    <Stack
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <Typography variant="p" component="p" fontWeight={500}>
                        {row?.sent_by_user?.username}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {row?.sent_by_user?.role}
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
        id: "view_file",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => (
          <Tooltip title="Ver e-email" sx={{ margin: -1 }}>
            <IconButton onClick={() => navigate(`/email/${row.id}`)}>
              <Visibility />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    []
  )

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isEmailsLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table mode="datatable" data={emails ?? []} columns={emailsTableColumns} />
          }
        />
      </Box>
    </Paper>
  )
}

export default EmailTable
